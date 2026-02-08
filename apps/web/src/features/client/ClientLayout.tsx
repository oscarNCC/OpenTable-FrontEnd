import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@monorepo/ui';
import { useAuth } from '../../contexts/AuthContext';

export function ClientLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b flex items-center justify-between px-4 py-2">
        <h1 className="text-lg font-semibold">客戶點餐</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{user?.name}</span>
          <Button variant="outline" onClick={handleLogout}>登出</Button>
        </div>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
