import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HistoryList } from './order/HistoryList';
import { OrderDetail } from './order/OrderDetail';
import { useAuth } from '../../contexts/AuthContext';
import './PosApp.css';

export function PosPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const refreshHistory = useCallback(() => setRefreshTrigger((n) => n + 1), []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Layout onRefresh={refreshHistory} onLogout={handleLogout}>
      <h1>當日客戶訂單</h1>
      <HistoryList
        refreshTrigger={refreshTrigger}
        onSelectOrder={(id) => setSelectedOrderId(id)}
        onSaved={refreshHistory}
      />
      <OrderDetail
        orderId={selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        onSaved={refreshHistory}
      />
    </Layout>
  );
}
