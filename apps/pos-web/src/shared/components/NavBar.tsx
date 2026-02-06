export interface NavBarProps {
  onRefresh?: () => void;
}

export function NavBar({ onRefresh }: NavBarProps) {
  return (
    <header className="pos-navbar">
      <div className="pos-navbar-inner">
        <span className="pos-navbar-brand">OpenTable POS</span>
        <div className="pos-navbar-actions">
          <span className="pos-navbar-page">客戶訂單</span>
          {onRefresh && (
            <button
              type="button"
              className="pos-navbar-refresh"
              onClick={onRefresh}
              aria-label="重整"
            >
              重整
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
