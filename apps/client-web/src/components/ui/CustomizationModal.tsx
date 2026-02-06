import { useState } from 'react';
import type { MenuItem } from '@monorepo/shared-types';
import { PIZZA_TOPPINGS } from '../../data/menu';

export interface CustomizationModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onConfirm: (toppings: string[]) => void;
}

export function CustomizationModal({ item, onClose, onConfirm }: CustomizationModalProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (t: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm([...selected]);
    onClose();
  };

  if (!item) return null;

  return (
    <div className="pizza-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="pizza-modal-title">
      <div className="pizza-modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="pizza-modal-panel">
        <div className="pizza-modal-header">
          <h2 id="pizza-modal-title" className="pizza-modal-title">{item.name}</h2>
          <button type="button" className="pizza-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="pizza-modal-body">
          <p className="label">選擇配料（可多選）</p>
          <div className="pizza-modal-toppings">
            {PIZZA_TOPPINGS.map((t) => (
              <button
                key={t}
                type="button"
                className={`pizza-topping-chip ${selected.has(t) ? 'active' : ''}`}
                onClick={() => toggle(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="pizza-modal-footer">
          <button type="button" className="pizza-btn-secondary" onClick={onClose}>Cancel</button>
          <button type="button" className="pizza-btn-primary" onClick={handleConfirm}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
