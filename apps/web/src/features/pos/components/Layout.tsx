import type { ReactNode } from 'react';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

export interface LayoutProps {
  children: ReactNode;
  onRefresh?: () => void;
  onLogout?: () => void;
}

export function Layout({ children, onRefresh, onLogout }: LayoutProps) {
  return (
    <div className="app-shell">
      <NavBar onRefresh={onRefresh} onLogout={onLogout} />
      <main className="app-main">
        <div className="app-content">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
