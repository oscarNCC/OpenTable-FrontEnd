import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, TableCard, ChartWrapper } from '@monorepo/ui';
import { api } from '../../shared/utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_TABLES = [
  { id: 't1', name: '1 號枱', maxPeople: 2, isEnabled: true, status: 'free' as const },
  { id: 't2', name: '2 號枱', maxPeople: 4, isEnabled: true, status: 'occupied' as const },
  { id: 't3', name: '3 號枱', maxPeople: 6, isEnabled: true, status: 'free' as const },
];

export function DashboardPage() {
  const { restaurantId } = useParams();
  const [analytics, setAnalytics] = useState<{
    turnoverRate: number;
    avgProfit: number;
    popularByPartySize?: { solo: { menuItemId: string; qty: number }[]; group: { menuItemId: string; qty: number }[] };
  } | null>(null);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics);
  }, []);

  const barData = analytics?.popularByPartySize
    ? [
        { name: '一人', count: analytics.popularByPartySize.solo.reduce((s, i) => s + i.qty, 0) },
        { name: '多人', count: analytics.popularByPartySize.group.reduce((s, i) => s + i.qty, 0) },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <Link to="/">
            <Button variant="outline">← 餐廳列表</Button>
          </Link>
          <h1 className="text-xl font-semibold">Dashboard · {restaurantId ?? ''}</h1>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">樓面枱位</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {MOCK_TABLES.map((t) => (
            <TableCard key={t.id} table={t} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 mb-8">
        <ChartWrapper title="返桌率">
          {analytics != null ? (
            <p className="text-3xl font-bold text-brand-600">{analytics.turnoverRate.toFixed(2)}</p>
          ) : (
            <span className="text-gray-400">載入中…</span>
          )}
        </ChartWrapper>
        <ChartWrapper title="平均盈利">
          {analytics != null ? (
            <p className="text-3xl font-bold text-brand-600">${analytics.avgProfit.toFixed(0)}</p>
          ) : (
            <span className="text-gray-400">載入中…</span>
          )}
        </ChartWrapper>
      </section>

      <section className="mb-8">
        <ChartWrapper title="熱門菜（依人數）">
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <span className="text-gray-400">尚無資料</span>
          )}
        </ChartWrapper>
      </section>
    </div>
  );
}
