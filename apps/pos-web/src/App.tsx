import { useState, useEffect, useCallback } from 'react';
import { HistoryList } from './features/order/HistoryList';
import { OrderDetail } from './features/order/OrderDetail';
import { Layout } from './shared/components/Layout';
import './App.css';

const POLL_INTERVAL_MS = 8000;

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const refreshHistory = useCallback(() => setRefreshTrigger((n) => n + 1), []);

  useEffect(() => {
    const id = setInterval(refreshHistory, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refreshHistory]);

  return (
    <Layout onRefresh={refreshHistory}>
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

export default App;
