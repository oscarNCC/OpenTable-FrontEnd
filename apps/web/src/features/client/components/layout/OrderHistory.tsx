import { useEffect, useState } from 'react';
import { getApiBase, getAuthHeaders } from '../../../../shared/api';

interface HistoryRecord {
  tableId?: string;
  diners?: number;
  items?: { menuItemId: string; qty: number }[];
  profit?: number;
  startTime?: string;
}

export function OrderHistory() {
  const [list, setList] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    const base = getApiBase();
    fetch(`${base}/api/data/history`, { headers: getAuthHeaders() })
      .then((r) => (r.ok ? r.json() : []))
      .then(setList)
      .catch(() => setList([]));
  }, []);

  if (list.length === 0) return null;

  return (
    <div className="pizza-order-history">
      <h3 className="pizza-order-history-title">Recent orders</h3>
      <div className="pizza-order-history-table-wrap">
        <table className="pizza-order-history-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Items</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {list.slice(0, 5).map((r, i) => (
              <tr key={i}>
                <td>{r.startTime ? new Date(r.startTime).toLocaleString() : '—'}</td>
                <td>{r.items?.length ?? 0}</td>
                <td>${r.profit ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
