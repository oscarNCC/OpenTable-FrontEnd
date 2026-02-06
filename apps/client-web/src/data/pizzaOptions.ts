import type { Topping, PizzaOptions } from '@monorepo/shared-types';

export const PIZZA_SIZES = [
  { id: '10', label: '10" Small' },
  { id: '12', label: '12" Medium' },
  { id: '14', label: '14" Large' },
] as const;

export const PIZZA_CRUSTS = [
  { id: 'original', label: 'Original Hand Tossed', extraCharge: 0 },
  { id: 'ny', label: 'New York Style (6 slices)', extraCharge: 0 },
  { id: 'thin', label: 'Crunchy Thin Crust (squares)', extraCharge: 0 },
  { id: 'pan', label: 'Handmade Pan', extraCharge: 2, maxToppings: 6 },
  { id: 'stuffed', label: 'Parmesan Stuffed', extraCharge: 3, onlyForSize: '12' },
  { id: 'glutenfree', label: 'Gluten Free', extraCharge: 2 },
] as const;

export const PIZZA_CHEESE_LEVELS = ['Light', 'Normal', 'Extra'] as const;

export const PIZZA_SAUCES = [
  { id: 'pizza', label: 'Pizza Sauce', levels: true as const },
  { id: 'bbq', label: 'BBQ' },
  { id: 'alfredo', label: 'Alfredo' },
  { id: 'marinara', label: 'Hearty Marinara' },
  { id: 'donair', label: 'Donair' },
  { id: 'ranch', label: 'Ranch' },
  { id: 'garlicparm', label: 'Garlic Parmesan' },
] as const;

export const TOPPINGS_MEAT: Topping[] = [
  { name: 'Pepperoni', type: 'meat', levels: 'Normal' },
  { name: 'Brooklyn Pepperoni', type: 'meat' },
  { name: 'Sausage', type: 'meat' },
  { name: 'Beef Crumble', type: 'meat' },
  { name: 'Donair Meat', type: 'meat', premium: true },
  { name: 'Ham', type: 'meat' },
  { name: 'Bacon Strip Crumble', type: 'meat', levels: 'Normal' },
  { name: 'Chicken', type: 'meat', premium: true },
  { name: 'Philly Steak', type: 'meat', premium: true },
];

export const TOPPINGS_NON_MEAT: Topping[] = [
  { name: 'Cheddar', type: 'non-meat', premium: true },
  { name: 'Feta', type: 'non-meat', premium: true },
  { name: 'Parmesan Asiago', type: 'non-meat', premium: true },
  { name: 'Provolone', type: 'non-meat', premium: true },
  { name: 'Hot Banana Peppers', type: 'non-meat' },
  { name: 'Black Olives', type: 'non-meat' },
  { name: 'Green Pepper', type: 'non-meat' },
  { name: 'Mushroom', type: 'non-meat', levels: 'Normal' },
  { name: 'Pineapple', type: 'non-meat' },
  { name: 'Onion', type: 'non-meat' },
  { name: 'Tomatoes', type: 'non-meat' },
  { name: 'Jalapeno Peppers', type: 'non-meat', levels: 'Normal' },
  { name: 'Baby Spinach', type: 'non-meat' },
  { name: 'Roasted Red Peppers', type: 'non-meat' },
];

export const PIZZA_SPECIALS = [
  { id: 'oregano', label: 'Oregano' },
  { id: 'redpepper', label: 'Crushed Red Peppers' },
  { id: 'garlicherbs', label: 'Garlic & Herbs' },
  { id: 'squarecut', label: 'Square Cut' },
  { id: 'bakelight', label: 'Bake Lightly Done' },
  { id: 'bakenormal', label: 'Bake Normal' },
] as const;

export const DIPPING_SAUCES = [
  { id: 'none', label: 'None' },
  { id: 'garlic', label: 'Garlic Dipping Sauce' },
  { id: 'ranch', label: 'Ranch Cup' },
  { id: 'cheddarhabanero', label: 'Cheddar Habanero Dip Cup' },
  { id: 'marinara', label: 'Marinara Sauce Cup' },
] as const;

const PAN_CRUST_ID = 'pan';

export function getMaxToppings(crustId: string): number {
  return crustId === PAN_CRUST_ID ? 6 : 7;
}

export const DEFAULT_PIZZA_OPTIONS = {
  size: '12',
  crust: 'original',
  sauce: 'pizza',
  sauceLevel: 'Normal' as const,
  cheese: 'Normal' as const,
  toppings: [] as { name: string; level?: 'Light' | 'Normal' | 'Extra' }[],
  specials: [] as string[],
  dippingSauce: 'none',
};

const SIZE_LABELS: Record<string, string> = { '10': '10"', '12': '12"', '14': '14"' };
const CRUST_LABELS: Record<string, string> = Object.fromEntries(
  PIZZA_CRUSTS.map((c) => [c.id, c.label.split('(')[0].trim()])
);

export function formatPizzaOptionsSummary(opts: PizzaOptions): string {
  const sizeLabel = SIZE_LABELS[opts.size] ?? opts.size;
  const crustLabel = CRUST_LABELS[opts.crust] ?? opts.crust;
  const parts = [sizeLabel, crustLabel];
  if (opts.toppings?.length) {
    parts.push(opts.toppings.map((t) => (t.level && t.level !== 'Normal' ? `${t.name} (${t.level})` : t.name)).join(', '));
  }
  return parts.join(' · ');
}
