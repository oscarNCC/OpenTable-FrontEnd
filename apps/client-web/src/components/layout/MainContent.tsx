import type { ReactNode } from 'react';

export interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return <main className="pizza-main">{children}</main>;
}
