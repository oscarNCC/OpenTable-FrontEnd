import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '@monorepo/ui';
import { getAuthHeaders, getApiBase } from '../../shared/api';

export function DataCollectionPreviewPage() {
  const [records, setRecords] = useState<unknown[]>([]);

  useEffect(() => {
    const base = getApiBase();
    fetch(`${base}/api/data/history`, { headers: getAuthHeaders() })
      .then((r) => (r.ok ? r.json() : []))
      .then(setRecords);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Raw 收集資料預覽</h1>
        <Link to="/admin">
          <Button variant="outline">← 回餐廳列表</Button>
        </Link>
      </header>
      <Card title={`共 ${records.length} 筆`}>
        {records.length === 0 ? (
          <p className="text-gray-500">尚無記錄</p>
        ) : (
          <pre className="text-xs overflow-auto max-h-[70vh] bg-gray-100 p-4 rounded">
            {JSON.stringify(records, null, 2)}
          </pre>
        )}
      </Card>
    </div>
  );
}
