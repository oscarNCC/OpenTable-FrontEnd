import { useCart } from '../../context/CartContext';
import { MENU_ITEMS } from '../../data/menu';
import { formatPizzaOptionsSummary } from '../../data/pizzaOptions';
import { PromoBanner } from './PromoBanner';
import { OrderHistory } from './OrderHistory';

const menuById = Object.fromEntries(MENU_ITEMS.map((m) => [m.id, m]));

export interface CartPanelProps {
  onCheckout: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export function CartPanel({ onCheckout, isSubmitting, error }: CartPanelProps) {
  const { items, setQtyAtIndex, totalCount, subtotal } = useCart();

  return (
    <aside className="pizza-cart-panel">
      <div className="pizza-cart-inner">
        <PromoBanner />
        <h2 className="pizza-cart-title">Your order</h2>
        {items.length === 0 ? (
          <p className="pizza-cart-empty">Cart is empty</p>
        ) : (
          <ul className="pizza-cart-list">
            {items.map((line, idx) => {
              const menuItem = menuById[line.menuItemId];
              return (
                <li key={`${line.menuItemId}-${idx}`} className="pizza-cart-line">
                  <div>
                    <span className="pizza-cart-line-name">{menuItem?.name ?? line.menuItemId}</span>
                    {line.pizzaOptions && (
                      <p className="pizza-cart-line-options">{formatPizzaOptionsSummary(line.pizzaOptions)}</p>
                    )}
                  </div>
                  <div className="pizza-cart-line-controls">
                    <button
                      type="button"
                      className="pizza-cart-qty-btn"
                      aria-label="Decrease"
                      onClick={() => setQtyAtIndex(idx, line.qty - 1)}
                    >
                      −
                    </button>
                    <span className="pizza-cart-qty-value">{line.qty}</span>
                    <button
                      type="button"
                      className="pizza-cart-qty-btn"
                      aria-label="Increase"
                      onClick={() => setQtyAtIndex(idx, line.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="pizza-cart-line-price">
                    ${(menuItem?.price ?? 0) * line.qty}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <div className="pizza-cart-footer">
          <div className="pizza-cart-total">
            <span>Total</span>
            <span>${subtotal}</span>
          </div>
          {error && <p className="pizza-cart-error">{error}</p>}
          <button
            type="button"
            className="pizza-btn-primary"
            disabled={totalCount === 0 || isSubmitting}
            onClick={onCheckout}
          >
            {isSubmitting ? 'Submitting…' : 'Submit order'}
          </button>
        </div>
        <OrderHistory />
      </div>
    </aside>
  );
}
