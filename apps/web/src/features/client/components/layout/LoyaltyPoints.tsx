export interface LoyaltyPointsProps {
  points?: number;
}

export function LoyaltyPoints({ points = 120 }: LoyaltyPointsProps) {
  return (
    <div className="pizza-loyalty">
      <span className="pizza-loyalty-label">Points</span>
      <span className="pizza-loyalty-value">{points}</span>
    </div>
  );
}
