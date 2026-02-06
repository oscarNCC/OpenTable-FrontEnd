import { useState } from 'react';
import type { MenuItem } from '@monorepo/shared-types';
import { useCart } from '../../context/CartContext';
import { MENU_CATEGORIES, MENU_BY_CATEGORY } from '../../data/menu';
import { GlassCard } from '../../components/ui/GlassCard';
import { Header } from '../../components/layout/Header';
import { Sidebar } from '../../components/layout/Sidebar';
import { MainContent } from '../../components/layout/MainContent';
import { CartPanel } from '../../components/layout/CartPanel';
import { api, getTableIdFromContext } from '../../shared/utils/api';
import type { CartLine } from '../../context/CartContext';

const PIZZA_CATEGORY = '披薩';

interface MenuShowcaseProps {
  onCustomizePizza?: (item: MenuItem, onConfirm: (toppings: string[]) => void) => void;
}

export function MenuShowcase({ onCustomizePizza }: MenuShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0] ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { items, addItem, totalCount, subtotal, clearCart } = useCart();

  const categoryItems = activeCategory ? MENU_BY_CATEGORY[activeCategory] ?? [] : [];

  const handleAddToCart = (item: MenuItem) => {
    if (item.category === PIZZA_CATEGORY && onCustomizePizza) {
      onCustomizePizza(item, (toppings) => {
        addItem(item.id, 1, toppings);
      });
    } else {
      addItem(item.id, 1);
    }
  };

  const handleCheckout = async () => {
    if (totalCount === 0) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const tableId = getTableIdFromContext();
      const profit = Math.round(subtotal * 0.3);
      const payload = {
        tableId,
        diners: 1,
        items: items.map((line: CartLine) => ({ menuItemId: line.menuItemId, qty: line.qty })),
        profit,
        startTime: new Date().toISOString(),
      };
      await api.collectData(payload);
      clearCart();
    } catch {
      setSubmitError('Submit failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="pizza-layout-content">
      <div className="pizza-body">
        <Sidebar
          categories={MENU_CATEGORIES}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <MainContent>
          <div className="pizza-menu-tabs-mobile">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pizza-menu-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="pizza-menu-grid">
            {categoryItems.map((item) => (
              <GlassCard key={item.id} highlight={item.category === PIZZA_CATEGORY && item.id === 'p1'}>
                <div className="pizza-menu-card">
                  {item.category === PIZZA_CATEGORY && item.id === 'p1' && (
                    <span className="pizza-hot-badge">Hot</span>
                  )}
                  {item.image && (
                    <div className="pizza-menu-card-image-wrap">
                      <img src={item.image} alt="" className="pizza-menu-card-image" />
                    </div>
                  )}
                  <div className="pizza-menu-card-info">
                    <span className="pizza-menu-card-name">{item.name}</span>
                    <span className="pizza-menu-card-price">${item.price}</span>
                  </div>
                  <button
                    type="button"
                    className="pizza-btn-primary pizza-btn-add"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </MainContent>
        <CartPanel
          onCheckout={handleCheckout}
          isSubmitting={isSubmitting}
          error={submitError}
        />
      </div>
      <div className="pizza-cart-footer-mobile" aria-label="Cart summary">
        <div className="pizza-cart-total">
          <span>{totalCount} items</span>
          <span>${subtotal}</span>
        </div>
        {submitError && <p className="pizza-cart-error">{submitError}</p>}
        <button
          type="button"
          className="pizza-btn-primary"
          disabled={totalCount === 0 || isSubmitting}
          onClick={handleCheckout}
        >
          {isSubmitting ? 'Submitting…' : 'Submit order'}
        </button>
      </div>
      </div>
    </>
  );
}
