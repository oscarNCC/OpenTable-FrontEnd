import { useEffect, useState } from 'react';
import type { OrderRecord } from '../../shared/utils/api';
import { api } from '../../shared/utils/api';
import { MENU_ITEMS } from '../../data/menu';

const menuById = Object.fromEntries(MENU_ITEMS.map((m) => [m.id, m]));

const STATUS_LABELS: Record<string, string> = {
  pending: '待處理',
  confirmed: '已確認',
  preparing: '製作中',
  completed: '已完成',
  cancelled: '已取消',
};

function formatElapsed(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  if (hour > 0) return `${hour} 小時 ${min % 60} 分`;
  if (min > 0) return `${min} 分鐘`;
  return `${sec} 秒`;
}

function OrderElapsedTimer({ startTime }: { startTime: string }) {
  const [elapsed, setElapsed] = useState(() => Date.now() - new Date(startTime).getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - new Date(startTime).getTime());
    }, 10000);
    return () => clearInterval(interval);
  }, [startTime]);

  return <span className="order-card-elapsed">已過 {formatElapsed(elapsed)}</span>;
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span className={`order-card-status order-card-status--${status}`} aria-label={label}>
      {label}
    </span>
  );
}

export interface HistoryListProps {
  refreshTrigger?: number;
  onSelectOrder: (orderId: string) => void;
  onSaved?: () => void;
}

export function HistoryList({ refreshTrigger = 0, onSelectOrder, onSaved }: HistoryListProps) {
  const [records, setRecords] = useState<OrderRecord[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    let cancelled = false;
    api.getHistory().then((list) => {
      if (!cancelled) setRecords(list);
    });
    return () => {
      cancelled = true;
    };
  }, [refreshTrigger]);

  const handleTick = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.updateOrder(id, { status: 'completed' });
      onSaved?.();
    } catch {
      // could add toast
    }
  };

  const handleCross = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('確定取消此訂單？')) return;
    try {
      await api.updateOrder(id, { status: 'cancelled' });
      onSaved?.();
    } catch {
      // could add toast
    }
  };

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onSelectOrder(id);
  };

  return (
    <section className="history-list">
      <h2>客戶訂單</h2>
      {records.length === 0 ? (
        <p className="history-list-empty">尚無客戶訂單</p>
      ) : (
        <ul className="history-list-cards">
          {records.map((r, i) => (
            <li key={r.id ?? `order-${i}`} className="order-card">
              <div className="order-card-top">
                <div
                  className="order-card-body"
                  onClick={() => r.id && toggleExpand(r.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && r.id) {
                      e.preventDefault();
                      toggleExpand(r.id);
                    }
                  }}
                >
                  <div className="order-card-header">
                    <span className="order-card-meta">
                      枱 {r.tableId} · {r.diners} 人 · {r.items.length} 項 · ${r.profit}
                    </span>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="order-card-time">
                    {new Date(r.startTime).toLocaleString()}
                    {r.status !== 'completed' && r.status !== 'cancelled' && (
                      <OrderElapsedTimer startTime={r.startTime} />
                    )}
                  </div>
                </div>
                <div className="order-card-actions">
                  <button
                    type="button"
                    className="order-card-btn order-card-btn--tick"
                    onClick={(e) => r.id && handleTick(e, r.id)}
                    aria-label="完成"
                    title="完成"
                    disabled={r.status === 'cancelled'}
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    className="order-card-btn order-card-btn--cross"
                    onClick={(e) => r.id && handleCross(e, r.id)}
                    aria-label="取消"
                    title="取消"
                    disabled={r.status === 'cancelled'}
                  >
                    ✗
                  </button>
                  <button
                    type="button"
                    className="order-card-btn order-card-btn--edit"
                    onClick={(e) => r.id && handleEdit(e, r.id)}
                    aria-label="編輯"
                    title="編輯"
                  >
                    ✎
                  </button>
                </div>
              </div>
              {expandedOrderId === r.id && (
                <div className="order-card-expand">
                  <h4 className="order-card-expand-title">訂單品項</h4>
                  <ul className="order-card-expand-items">
                    {r.items
                      .filter((line) => line.qty > 0)
                      .map((line) => (
                        <li key={line.menuItemId} className="order-card-expand-item">
                          <span className="order-card-expand-item-name">
                            {menuById[line.menuItemId]?.name ?? line.menuItemId}
                          </span>
                          <span className="order-card-expand-item-qty">× {line.qty}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
