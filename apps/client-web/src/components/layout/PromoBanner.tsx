export interface PromoBannerProps {
  text?: string;
}

const DEFAULT_PROMO = 'Today: 2nd pizza 50% off';

export function PromoBanner({ text = DEFAULT_PROMO }: PromoBannerProps) {
  return (
    <div className="pizza-promo-banner">
      <span className="pizza-promo-text">{text}</span>
    </div>
  );
}
