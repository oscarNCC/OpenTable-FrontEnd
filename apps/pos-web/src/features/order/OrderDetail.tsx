import { useEffect, useState } from 'react';
import type { OrderRecord, OrderUpdateBody } from '../../shared/utils/api';
import { api } from '../../shared/utils/api';
import { MENU_ITEMS } from '../../data/menu';

const TABLE_OPTIONS = [
  { id: 't1', name: '1 號枱' },
  { id: 't2', name: '2 號枱' },
  { id: 't3', name: '3 號枱' },
];

const STATUS_OPTIONS = [
  { value: '', label: '—' },
  { value: 'pending', label: '待處理' },
  { value: 'confirmed', label: '已確認' },
  { value: 'preparing', label: '製作中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

const menuIdToIndex = Object.fromEntries(MENU_ITEMS.map((m, i) => [m.id, i]));

export interface OrderDetailProps {
  orderId: string | null;
  onClose: () => void;
  onSaved: () => void;
}

export function OrderDetail({ orderId, onClose, onSaved }: OrderDetailProps) {
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tableId, setTableId] = useState('');
  const [diners, setDiners] = useState(1);
  const [startTime, setStartTime] = useState('');
  const [items, setItems] = useState<{ menuItemId: string; qty: number }[]>(() =>
    MENU_ITEMS.map((item) => ({ menuItemId: item.id, qty: 0 }))
  );
  const [profit, setProfit] = useState(0);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!orderId) {
      setOrder(null);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .getOrderById(orderId)
      .then((data) => {
        setOrder(data);
        setTableId(data.tableId);
        setDiners(data.diners);
        setStartTime(data.startTime.slice(0, 16));
        setProfit(data.profit);
        setStatus(data.status ?? '');
        setNotes(data.notes ?? '');
        const nextItems = MENU_ITEMS.map((item) => {
          const line = data.items.find((i) => i.menuItemId === item.id);
          return { menuItemId: item.id, qty: line?.qty ?? 0 };
        });
        setItems(nextItems);
      })
      .catch(() => setError('無法載入訂單'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const setQty = (menuItemId: string, delta: number) => {
    const idx = menuIdToIndex[menuItemId];
    if (idx == null) return;
    const next = [...items];
    const cur = next[idx]?.qty ?? 0;
    next[idx] = { menuItemId, qty: Math.max(0, cur + delta) };
    setItems(next);
  };

  const getQty = (menuItemId: string) => {
    const idx = menuIdToIndex[menuItemId];
    return idx != null ? (items[idx]?.qty ?? 0) : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !order) return;
    const withQty = items.filter((i) => i.qty > 0);
    if (withQty.length === 0) {
      setError('請至少保留一項品項');
      return;
    }
    setError(null);
    const body: OrderUpdateBody = {
      tableId,
      diners,
      startTime: startTime ? new Date(startTime).toISOString() : order.startTime,
      items: withQty,
      profit,
    };
    if (status !== undefined) body.status = status || undefined;
    if (notes !== undefined) body.notes = notes || undefined;
    setSaving(true);
    setError(null);
    try {
      await api.updateOrder(orderId, body);
      onSaved();
      onClose();
    } catch {
      setError('儲存失敗');
    } finally {
      setSaving(false);
    }
  };

  if (!orderId) return null;

  return (
    <div className="order-detail-overlay" role="dialog" aria-modal="true" aria-labelledby="order-detail-title">
      <div className="order-detail-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="order-detail-panel">
        <div className="order-detail-header">
          <h2 id="order-detail-title">訂單詳情 · 編輯</h2>
          <button type="button" className="order-detail-close" onClick={onClose} aria-label="關閉">
            ×
          </button>
        </div>
        {loading ? (
          <p>載入中…</p>
        ) : error && !order ? (
          <p className="order-detail-error">{error}</p>
        ) : order ? (
          <form onSubmit={handleSubmit} className="order-detail-form">
            {error && <p className="order-detail-error">{error}</p>}
            <div className="order-detail-field">
              <label>枱號</label>
              <select value={tableId} onChange={(e) => setTableId(e.target.value)}>
                {TABLE_OPTIONS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="order-detail-field">
              <label>人數</label>
              <input
                type="number"
                min={1}
                max={20}
                value={diners}
                onChange={(e) => setDiners(Number(e.target.value))}
              />
            </div>
            <div className="order-detail-field">
              <label>開始時間</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="order-detail-field">
              <label>盈利 ($)</label>
              <input
                type="number"
                min={0}
                value={profit}
                onChange={(e) => setProfit(Number(e.target.value))}
              />
            </div>
            <div className="order-detail-field">
              <label>狀態</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value || 'none'} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="order-detail-field">
              <label>備註</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
            </div>
            <div className="order-detail-field">
              <label>品項</label>
              <ul className="order-detail-items">
                {MENU_ITEMS.map((item) => (
                  <li key={item.id} className="order-detail-item-row">
                    <span>{item.name}</span>
                    <div className="order-detail-item-controls">
                      <button type="button" className="menu-qty-btn" onClick={() => setQty(item.id, -1)} aria-label="減少" disabled={getQty(item.id) <= 0}>−</button>
                      <span className="menu-qty-value">{getQty(item.id)}</span>
                      <button type="button" className="menu-qty-btn" onClick={() => setQty(item.id, 1)} aria-label="增加">+</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-detail-actions">
              <button type="button" className="order-detail-btn order-detail-btn--cross" onClick={onClose} aria-label="取消">
                <span aria-hidden="true">✗</span> 取消
              </button>
              <button type="submit" className="order-detail-btn order-detail-btn--tick" disabled={saving} aria-label="儲存">
                <span aria-hidden="true">✓</span> {saving ? '儲存中…' : '儲存'}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
}
