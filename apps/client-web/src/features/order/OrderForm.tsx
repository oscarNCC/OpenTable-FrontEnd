import { useState } from 'react';
import type { CollectDataReq } from '@monorepo/shared-types';
import { Button } from '@monorepo/ui';
import { api, getTableIdFromContext } from '../../shared/utils/api';
import { MENU_ITEMS, MENU_CATEGORIES, MENU_BY_CATEGORY } from '../../data/menu';

const menuIdToIndex = Object.fromEntries(MENU_ITEMS.map((m, i) => [m.id, i]));

export function OrderForm() {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0] ?? '');
  const [items, setItems] = useState<{ menuItemId: string; qty: number }[]>(() =>
    MENU_ITEMS.map((item) => ({ menuItemId: item.id, qty: 0 }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setQty = (menuItemId: string, delta: number) => {
    const idx = menuIdToIndex[menuItemId];
    if (idx == null) return;
    const next = [...items];
    const cur = next[idx]?.qty ?? 0;
    next[idx] = { menuItemId, qty: Math.max(0, cur + delta) };
    setItems(next);
    setSubmitError(null);
  };

  const getQty = (menuItemId: string) => {
    const idx = menuIdToIndex[menuItemId];
    return idx != null ? (items[idx]?.qty ?? 0) : 0;
  };

  const withQty = items.filter((i) => i.qty > 0);
  const totalCount = withQty.reduce((sum, i) => sum + i.qty, 0);
  const menuMap = Object.fromEntries(MENU_ITEMS.map((m) => [m.id, m]));
  const subtotal = withQty.reduce(
    (sum, i) => sum + (menuMap[i.menuItemId]?.price ?? 0) * i.qty,
    0
  );

  const handleSubmit = async () => {
    if (totalCount === 0) {
      setSubmitError('請至少選擇一道菜');
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const tableId = getTableIdFromContext();
      const profit = Math.round(subtotal * 0.3);
      const payload: CollectDataReq = {
        tableId,
        diners: 1,
        items: withQty,
        profit,
        startTime: new Date().toISOString(),
      };
      await api.collectData(payload);
      setItems(MENU_ITEMS.map((item) => ({ menuItemId: item.id, qty: 0 })));
    } catch (e) {
      setSubmitError('送出失敗，請再試一次');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryItems = activeCategory ? MENU_BY_CATEGORY[activeCategory] ?? [] : [];

  return (
    <>
      <div className="order-content">
        <div className="menu-tabs" role="tablist">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`menu-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="menu-cards">
          {categoryItems.map((item) => {
            const qty = getQty(item.id);
            return (
              <div key={item.id} className="menu-card">
                {item.image && (
                  <div className="menu-card-image-wrap">
                    <img src={item.image} alt="" className="menu-card-image" />
                  </div>
                )}
                <div className="menu-card-info">
                  <span className="menu-card-name">{item.name}</span>
                  <span className="menu-card-price">${item.price}</span>
                </div>
                <div className="menu-card-controls">
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="減少"
                    onClick={() => setQty(item.id, -1)}
                    disabled={qty <= 0}
                  >
                    −
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="增加"
                    onClick={() => setQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="order-spacer" aria-hidden="true" />
      </div>

      <footer className="order-footer">
        {submitError && <p className="order-footer-error">{submitError}</p>}
        <div className="order-footer-summary">
          <span className="order-footer-count">已選 {totalCount} 項</span>
          <span className="order-footer-total">小計 ${subtotal}</span>
        </div>
        <Button
          type="button"
          className="order-submit-btn"
          disabled={isSubmitting || totalCount === 0}
          onClick={handleSubmit}
        >
          {isSubmitting ? '送出中…' : '送出訂單'}
        </Button>
      </footer>
    </>
  );
}
