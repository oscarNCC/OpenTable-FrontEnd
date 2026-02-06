import type { ReactNode } from 'react';

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
}

export function GlassCard({ children, className = '', highlight }: GlassCardProps) {
  return (
    <div
      className={`pizza-glass-card ${highlight ? 'pizza-glass-card--highlight' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
