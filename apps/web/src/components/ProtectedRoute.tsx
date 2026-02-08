import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ROLE_HOME: Record<string, string> = {
  admin: '/admin',
  staff: '/pos',
  client: '/client',
};

export interface ProtectedRouteProps {
  children: React.ReactNode;
  /** 若提供，僅允許這些角色進入；否則導向該角色首頁 */
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500">載入中…</span>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    const home = ROLE_HOME[user.role] ?? '/admin';
    return <Navigate to={home} replace />;
  }
  return <>{children}</>;
}
