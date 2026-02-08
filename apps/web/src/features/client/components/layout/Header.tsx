import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { LoyaltyPoints } from './LoyaltyPoints';

function formatEta(totalItems: number): string {
  if (totalItems === 0) return '—';
  const min = 20 + totalItems * 5;
  return `~${min} min`;
}

export function Header() {
  const { totalCount, subtotal } = useCart();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="pizza-header">
      <div className="pizza-header-inner">
        <h1 className="pizza-header-title">Pizza</h1>
        <div className="pizza-header-right">
          <LoyaltyPoints />
          <div className="pizza-header-summary">
            <span className="pizza-header-ticker">
              {totalCount} {totalCount === 1 ? 'item' : 'items'} · ${subtotal}
            </span>
            <span className="pizza-header-eta">{formatEta(totalCount)}</span>
          </div>
          <button type="button" className="pizza-topping-chip" onClick={handleLogout}>登出</button>
        </div>
      </div>
    </header>
  );
}
