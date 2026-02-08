import type { MenuItem } from '@monorepo/shared-types';

export const MENU_ITEMS: MenuItem[] = [
  { id: 'p1', name: '瑪格麗特披薩', price: 199, category: '披薩', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
  { id: 'p2', name: '夏威夷披薩', price: 219, category: '披薩', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400' },
  { id: 'p3', name: '辣味香腸披薩', price: 229, category: '披薩', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  { id: 'p4', name: '四重起司披薩', price: 239, category: '披薩', image: 'https://images.unsplash.com/photo-1574128594517-43964a2d1252?w=400' },
  { id: 'p5', name: 'BBQ 雞肉披薩', price: 239, category: '披薩', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400' },
  { id: 'p6', name: '義式臘腸披薩', price: 229, category: '披薩', image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400' },
  { id: 'p7', name: '蔬菜總匯披薩', price: 219, category: '披薩', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400' },
  { id: 'p8', name: '海鮮披薩', price: 269, category: '披薩', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  { id: 's1', name: '蒜香麵包', price: 69, category: '小食', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400' },
  { id: 's2', name: '辣雞翼（6件）', price: 129, category: '小食', image: 'https://images.unsplash.com/photo-1567620832903-1fcdec93bede?w=400' },
  { id: 's3', name: '薯條', price: 59, category: '小食', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' },
  { id: 's4', name: '洋蔥圈', price: 69, category: '小食', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400' },
  { id: 's5', name: '起司條', price: 89, category: '小食', image: 'https://images.unsplash.com/photo-1548340747-9e35bd32f1e8?w=400' },
  { id: 'd1', name: '可樂', price: 35, category: '飲品', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400' },
  { id: 'd2', name: '雪碧', price: 35, category: '飲品', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' },
  { id: 'd3', name: '檸檬茶', price: 45, category: '飲品', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
  { id: 'd4', name: '冰茶', price: 45, category: '飲品', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
  { id: 'd5', name: '橙汁', price: 55, category: '飲品', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400' },
  { id: 't1', name: '布朗尼', price: 79, category: '甜點', image: 'https://images.unsplash.com/photo-1564355808520-4b4aed45a0e8?w=400' },
  { id: 't2', name: '肉桂卷', price: 69, category: '甜點', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' },
  { id: 't3', name: '雪糕（單球）', price: 49, category: '甜點', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' },
];

export const MENU_CATEGORIES: string[] = ['披薩', '小食', '飲品', '甜點'];

export const MENU_BY_CATEGORY: Record<string, MenuItem[]> = MENU_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat] = MENU_ITEMS.filter((item) => item.category === cat);
    return acc;
  },
  {} as Record<string, MenuItem[]>
);
