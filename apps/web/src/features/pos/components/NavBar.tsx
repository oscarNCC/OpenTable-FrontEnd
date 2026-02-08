export interface NavBarProps {
  onRefresh?: () => void;
  onLogout?: () => void;
}

export function NavBar({ onRefresh, onLogout }: NavBarProps) {
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
          {onLogout && (
            <button
              type="button"
              className="pos-navbar-refresh"
              onClick={onLogout}
              aria-label="登出"
            >
              登出
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
