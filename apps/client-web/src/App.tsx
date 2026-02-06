import { useState, useRef } from 'react';
import type { MenuItem } from '@monorepo/shared-types';
import { CartProvider } from './context/CartContext';
import { MenuShowcase } from './features/order/MenuShowcase';
import { CustomizationModal } from './components/ui/CustomizationModal';
import './App.css';

function App() {
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const pendingConfirmRef = useRef<(toppings: string[]) => void>(() => {});

  const handleCustomizePizza = (item: MenuItem, onConfirm: (toppings: string[]) => void) => {
    pendingConfirmRef.current = onConfirm;
    setCustomizingItem(item);
  };

  const handleModalConfirm = (toppings: string[]) => {
    pendingConfirmRef.current(toppings);
    setCustomizingItem(null);
  };

  return (
    <CartProvider>
      <div className="client-app">
        <div className="pizza-layout">
          <MenuShowcase onCustomizePizza={handleCustomizePizza} />
        </div>
      </div>
      <CustomizationModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
        onConfirm={handleModalConfirm}
      />
    </CartProvider>
  );
}

export default App;
