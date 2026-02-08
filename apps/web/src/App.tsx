import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './features/auth/LoginPage';
import { AdminLayout } from './features/admin/AdminLayout';
import { RestaurantsPage } from './features/admin/RestaurantsPage';
import { DashboardPage } from './features/admin/DashboardPage';
import { DataCollectionPreviewPage } from './features/admin/DataCollectionPreviewPage';
import { AccountManagementPage } from './features/admin/AccountManagementPage';
import { PosLayout } from './features/pos/PosLayout';
import { PosPage } from './features/pos/PosPage';
import { ClientPage } from './features/client/ClientPage';
import { AccountSettingsPage } from './features/account/AccountSettingsPage';

const ROLE_ROUTES: Record<string, string> = {
  admin: '/admin',
  staff: '/pos',
  client: '/client',
};

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <span className="text-gray-500">載入中…</span>;
  if (!user) return <Navigate to="/login" replace />;
  const route = ROLE_ROUTES[user.role] ?? '/admin';
  return <Navigate to={route} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RestaurantsPage />} />
          <Route path="restaurant/:restaurantId" element={<DashboardPage />} />
          <Route path="accounts" element={<AccountManagementPage />} />
          <Route path="data-preview" element={<DataCollectionPreviewPage />} />
        </Route>
        <Route
          path="/pos"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <PosLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PosPage />} />
        </Route>
        <Route
          path="/client"
          element={
            <ProtectedRoute allowedRoles={['client']}>
              <ClientPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff', 'client']}>
              <AccountSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
