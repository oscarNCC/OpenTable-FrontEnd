import { useState, useRef } from 'react';
import type { MenuItem, PizzaOptions } from '@monorepo/shared-types';
import { CartProvider } from './context/CartContext';
import { MenuShowcase } from './MenuShowcase';
import { CustomizationModal } from './components/ui/CustomizationModal';
import './ClientApp.css';

export function ClientPage() {
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const pendingConfirmRef = useRef<(options: PizzaOptions) => void>(() => {});

  const handleCustomizePizza = (item: MenuItem, onConfirm: (options: PizzaOptions) => void) => {
    pendingConfirmRef.current = onConfirm;
    setCustomizingItem(item);
  };

  const handleModalConfirm = (options: PizzaOptions) => {
    pendingConfirmRef.current(options);
    setCustomizingItem(null);
  };

  return (
    <CartProvider>
      <div className="client-app">
        <div className="pizza-layout">
          <MenuShowcase onCustomizePizza={handleCustomizePizza} />
        </div>
        <CustomizationModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
          onConfirm={handleModalConfirm}
        />
      </div>
    </CartProvider>
  );
}
