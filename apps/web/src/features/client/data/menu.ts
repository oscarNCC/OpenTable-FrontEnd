import type { MenuItem } from '@monorepo/shared-types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'p1', name: 'Margherita Pizza', price: 199, category: 'Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
  { id: 'p2', name: 'Hawaiian Pizza', price: 219, category: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
  { id: 'p3', name: 'Spicy Sausage Pizza', price: 229, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  { id: 'p4', name: 'Four Cheese Pizza', price: 239, category: 'Pizza', image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=400' },
  { id: 'p5', name: 'BBQ Chicken Pizza', price: 239, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400' },
  { id: 'p6', name: 'Italian Salami Pizza', price: 229, category: 'Pizza', image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400' },
  { id: 'p7', name: 'Veggie Supreme Pizza', price: 219, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400' },
  { id: 'p8', name: 'Seafood Pizza', price: 269, category: 'Pizza', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  { id: 's1', name: 'Garlic Bread', price: 69, category: 'Sides', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400' },
  { id: 's2', name: 'Spicy Wings (6pcs)', price: 129, category: 'Sides', image: 'https://images.unsplash.com/photo-1567620832903-1fcdec93bede?w=400' },
  { id: 's3', name: 'French Fries', price: 59, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' },
  { id: 's4', name: 'Onion Rings', price: 69, category: 'Sides', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400' },
  { id: 's5', name: 'Mozzarella Sticks', price: 89, category: 'Sides', image: 'https://images.unsplash.com/photo-1548340747-9e35bd32f1e8?w=400' },
  { id: 'd1', name: 'Cola', price: 35, category: 'Drinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400' },
  { id: 'd2', name: 'Sprite', price: 35, category: 'Drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' },
  { id: 'd3', name: 'Lemon Tea', price: 45, category: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
  { id: 'd4', name: 'Iced Tea', price: 45, category: 'Drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
  { id: 'd5', name: 'Orange Juice', price: 55, category: 'Drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400' },
  { id: 't1', name: 'Brownie', price: 79, category: 'Desserts', image: 'https://images.unsplash.com/photo-1564355808520-4b4aed45a0e8?w=400' },
  { id: 't2', name: 'Cinnamon Roll', price: 69, category: 'Desserts', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' },
  { id: 't3', name: 'Ice Cream (Single Scoop)', price: 49, category: 'Desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
];

export const MENU_CATEGORIES: string[] = ['Pizza', 'Sides', 'Drinks', 'Desserts'];

export const MENU_BY_CATEGORY: Record<string, MenuItem[]> = MENU_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat] = MENU_ITEMS.filter((item) => item.category === cat);
    return acc;
  },
  {} as Record<string, MenuItem[]>
);
