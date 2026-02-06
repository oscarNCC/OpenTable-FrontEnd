import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/useAuth';
import { LoginPage } from './features/auth/LoginPage';
import { RestaurantsPage } from './features/restaurants/RestaurantsPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { DataCollectionPreviewPage } from './features/data-collection-preview/DataCollectionPreviewPage';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={user ? <RestaurantsPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/restaurant/:restaurantId"
        element={user ? <DashboardPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/data-preview"
        element={user ? <DataCollectionPreviewPage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
