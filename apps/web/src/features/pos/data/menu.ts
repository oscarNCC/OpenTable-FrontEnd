import type { MenuItem } from '@monorepo/shared-types';

/** Pizza shop menu - same as client for consistency */
export const MENU_ITEMS: MenuItem[] = [
  { id: 'p1', name: 'Margherita Pizza', price: 199, category: 'Pizza' },
  { id: 'p2', name: 'Hawaiian Pizza', price: 219, category: 'Pizza' },
  { id: 'p3', name: 'Spicy Sausage Pizza', price: 229, category: 'Pizza' },
  { id: 'p4', name: 'Four Cheese Pizza', price: 239, category: 'Pizza' },
  { id: 'p5', name: 'BBQ Chicken Pizza', price: 239, category: 'Pizza' },
  { id: 'p6', name: 'Italian Salami Pizza', price: 229, category: 'Pizza' },
  { id: 'p7', name: 'Veggie Supreme Pizza', price: 219, category: 'Pizza' },
  { id: 'p8', name: 'Seafood Pizza', price: 269, category: 'Pizza' },
  { id: 's1', name: 'Garlic Bread', price: 69, category: 'Sides' },
  { id: 's2', name: 'Spicy Wings (6pcs)', price: 129, category: 'Sides' },
  { id: 's3', name: 'French Fries', price: 59, category: 'Sides' },
  { id: 's4', name: 'Onion Rings', price: 69, category: 'Sides' },
  { id: 's5', name: 'Mozzarella Sticks', price: 89, category: 'Sides' },
  { id: 'd1', name: 'Cola', price: 35, category: 'Drinks' },
  { id: 'd2', name: 'Sprite', price: 35, category: 'Drinks' },
  { id: 'd3', name: 'Lemon Tea', price: 45, category: 'Drinks' },
  { id: 'd4', name: 'Iced Tea', price: 45, category: 'Drinks' },
  { id: 'd5', name: 'Orange Juice', price: 55, category: 'Drinks' },
  { id: 't1', name: 'Brownie', price: 79, category: 'Desserts' },
  { id: 't2', name: 'Cinnamon Roll', price: 69, category: 'Desserts' },
  { id: 't3', name: 'Ice Cream (Single Scoop)', price: 49, category: 'Desserts' },
];

export const MENU_CATEGORIES: string[] = ['Pizza', 'Sides', 'Drinks', 'Desserts'];

export const MENU_BY_CATEGORY: Record<string, MenuItem[]> = MENU_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat] = MENU_ITEMS.filter((item) => item.category === cat);
    return acc;
  },
  {} as Record<string, MenuItem[]>
);
