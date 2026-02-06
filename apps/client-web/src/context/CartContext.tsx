import { createContext, useContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { MENU_ITEMS } from '../data/menu';

export interface CartLine {
  menuItemId: string;
  qty: number;
  toppings?: string[];
}

interface CartContextValue {
  items: CartLine[];
  addItem: (menuItemId: string, qty?: number, toppings?: string[]) => void;
  removeItem: (menuItemId: string) => void;
  setQty: (menuItemId: string, qty: number) => void;
  setQtyAtIndex: (index: number, qty: number) => void;
  totalCount: number;
  subtotal: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const menuById = Object.fromEntries(MENU_ITEMS.map((m) => [m.id, m]));

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  const addItem = useCallback((menuItemId: string, qty = 1, toppings?: string[]) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.menuItemId === menuItemId && JSON.stringify(x.toppings ?? []) === JSON.stringify(toppings ?? []));
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i]!, qty: next[i]!.qty + qty };
        return next;
      }
      return [...prev, { menuItemId, qty, toppings }];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((x) => x.menuItemId !== menuItemId));
  }, []);

  const setQty = useCallback((menuItemId: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((x) => x.menuItemId !== menuItemId));
      return;
    }
    setItems((prev) => {
      const i = prev.findIndex((x) => x.menuItemId === menuItemId);
      if (i < 0) return prev;
      const next = [...prev];
      next[i] = { ...next[i]!, qty };
      return next;
    });
  }, []);

  const setQtyAtIndex = useCallback((index: number, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((_, i) => i !== index));
      return;
    }
    setItems((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const next = [...prev];
      next[index] = { ...next[index]!, qty };
      return next;
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (menuById[i.menuItemId]?.price ?? 0) * i.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQty, setQtyAtIndex, totalCount, subtotal, clearCart }),
    [items, addItem, removeItem, setQty, setQtyAtIndex, totalCount, subtotal, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
