import type { MenuItem } from '@monorepo/shared-types';

/** Pizza shop menu - same as client-web for consistency */
export const MENU_ITEMS: MenuItem[] = [
  { id: 'p1', name: '瑪格麗特披薩', price: 199, category: '披薩' },
  { id: 'p2', name: '夏威夷披薩', price: 219, category: '披薩' },
  { id: 'p3', name: '辣味香腸披薩', price: 229, category: '披薩' },
  { id: 'p4', name: '四重起司披薩', price: 239, category: '披薩' },
  { id: 'p5', name: 'BBQ 雞肉披薩', price: 239, category: '披薩' },
  { id: 'p6', name: '義式臘腸披薩', price: 229, category: '披薩' },
  { id: 'p7', name: '蔬菜總匯披薩', price: 219, category: '披薩' },
  { id: 'p8', name: '海鮮披薩', price: 269, category: '披薩' },
  { id: 's1', name: '蒜香麵包', price: 69, category: '小食' },
  { id: 's2', name: '辣雞翼（6件）', price: 129, category: '小食' },
  { id: 's3', name: '薯條', price: 59, category: '小食' },
  { id: 's4', name: '洋蔥圈', price: 69, category: '小食' },
  { id: 's5', name: '起司條', price: 89, category: '小食' },
  { id: 'd1', name: '可樂', price: 35, category: '飲品' },
  { id: 'd2', name: '雪碧', price: 35, category: '飲品' },
  { id: 'd3', name: '檸檬茶', price: 45, category: '飲品' },
  { id: 'd4', name: '冰茶', price: 45, category: '飲品' },
  { id: 'd5', name: '橙汁', price: 55, category: '飲品' },
  { id: 't1', name: '布朗尼', price: 79, category: '甜點' },
  { id: 't2', name: '肉桂卷', price: 69, category: '甜點' },
  { id: 't3', name: '雪糕（單球）', price: 49, category: '甜點' },
];

export const MENU_CATEGORIES: string[] = ['披薩', '小食', '飲品', '甜點'];

export const MENU_BY_CATEGORY: Record<string, MenuItem[]> = MENU_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat] = MENU_ITEMS.filter((item) => item.category === cat);
    return acc;
  },
  {} as Record<string, MenuItem[]>
);
