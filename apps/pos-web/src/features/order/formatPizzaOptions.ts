import type { PizzaOptions } from '@monorepo/shared-types';

const SIZE_LABELS: Record<string, string> = { '10': '10"', '12': '12"', '14': '14"' };
const CRUST_LABELS: Record<string, string> = {
  original: 'Original Hand Tossed',
  ny: 'New York Style',
  thin: 'Crunchy Thin Crust',
  pan: 'Handmade Pan',
  stuffed: 'Parmesan Stuffed',
  glutenfree: 'Gluten Free',
};

export function formatPizzaOptionsSummary(opts: PizzaOptions): string {
  const sizeLabel = SIZE_LABELS[opts.size] ?? opts.size;
  const crustLabel = CRUST_LABELS[opts.crust] ?? opts.crust;
  const parts = [sizeLabel, crustLabel];
  if (opts.toppings?.length) {
    parts.push(
      opts.toppings
        .map((t) => (t.level && t.level !== 'Normal' ? `${t.name} (${t.level})` : t.name))
        .join(', ')
    );
  }
  return parts.join(' · ');
}
