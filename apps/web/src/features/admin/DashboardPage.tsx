import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, ChartWrapper } from '@monorepo/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GoogleMap, useJsApiLoader, HeatmapLayer } from '@react-google-maps/api';
import { getHistory, getHeatmapData } from '../../shared/api';

const MAP_CENTER = { lat: 51.0447, lng: -114.0719 }; // Calgary
const MAP_CONTAINER_STYLE = { width: '100%', height: '400px' };

function OrderHeatmap() {
  const [points, setPoints] = useState<{ lat: number; lng: number; weight: number }[]>([]);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // User to replace
    libraries: ['visualization'],
  });

  useEffect(() => {
    getHeatmapData().then(setPoints).catch(console.error);
  }, []);

  const heatmapData = useMemo(() => {
    if (!window.google) return [];
    return points.map(p => ({
      location: new window.google.maps.LatLng(p.lat, p.lng),
      weight: p.weight
    }));
  }, [points]);

  if (!isLoaded) return <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">載入地圖中...</div>;

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={MAP_CENTER}
      zoom={12}
    >
      <HeatmapLayer data={heatmapData as any} />
    </GoogleMap>
  );
}
import type { OrderRecord } from '../../shared/api';
import { MENU_ITEMS } from '../client/data/menu';

const BUSINESS_HOURS = 12; // 假設營業 12 小時

function useOrderStats(restaurantId: string | undefined) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }
    const from = new Date();
    from.setDate(from.getDate() - 7);
    getHistory({
      restaurantId,
      from: from.toISOString(),
      to: new Date().toISOString(),
    })
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [restaurantId]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter((o) => o.startTime.startsWith(today));
    const todayItems = todayOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);
    const completed = orders.filter((o) => o.status === 'completed').length;
    const avgProfit = orders.length ? orders.reduce((s, o) => s + o.profit, 0) / orders.length : 0;
    const completionRate = orders.length ? (completed / orders.length) * 100 : 0;
    const ordersPerHour = BUSINESS_HOURS > 0 ? todayOrders.length / BUSINESS_HOURS : 0;
    const dishesPerHour = BUSINESS_HOURS > 0 ? todayItems / BUSINESS_HOURS : 0;

    const itemCount: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((line) => {
        if (line.qty > 0) {
          itemCount[line.menuItemId] = (itemCount[line.menuItemId] ?? 0) + line.qty;
        }
      });
    });
    const popularItems = Object.entries(itemCount)
      .map(([menuItemId, qty]) => {
        const item = MENU_ITEMS.find((m) => m.id === menuItemId);
        return { menuItemId, name: item?.name ?? menuItemId, qty };
      })
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 8);

    // Group by postal code
    const postalCount: Record<string, number> = {};
    orders.forEach((o) => {
      const pc = o.postalCode || '未知';
      postalCount[pc] = (postalCount[pc] ?? 0) + 1;
    });
    const postalData = Object.entries(postalCount)
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count);

    const ordersWithWait = orders.filter((o) => o.startTime && o.acceptedAt);
    const avgWait = ordersWithWait.length
      ? ordersWithWait.reduce((sum, o) => {
          const start = new Date(o.startTime).getTime();
          const accept = new Date(o.acceptedAt!).getTime();
          return sum + (accept - start);
        }, 0) / ordersWithWait.length / 60000 // in minutes
      : 0;

    // Topping statistics
    const toppingCount: Record<string, number> = {};
    orders.forEach((o) => {
      o.items.forEach((item) => {
        let options = item.pizzaOptions;
        if (typeof options === 'string') {
          try { options = JSON.parse(options); } catch { options = null; }
        }
        const opt = options as { toppings?: string[] } | undefined;
        if (opt?.toppings) {
          opt.toppings.forEach((t) => {
            toppingCount[t] = (toppingCount[t] ?? 0) + item.qty;
          });
        }
      });
    });
    const toppingData = Object.entries(toppingCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      todayOrders: todayOrders.length,
      ordersPerHour,
      dishesPerHour,
      todayItems,
      completionRate,
      avgProfit,
      popularItems,
      postalData,
      avgWait,
      toppingData,
      totalOrders: orders.length,
    };
  }, [orders]);

  return { loading, stats, orders };
}

export function DashboardPage() {
  const { restaurantId } = useParams();
  const { loading, stats } = useOrderStats(restaurantId);
  const [densityTab, setDensityTab] = useState<'heatmap' | 'postal'>('heatmap');
  const [isSeeding, setIsSeeding] = useState(false);

  const barData = stats.popularItems.map((i) => ({ name: i.name, count: i.qty }));

  const handleSeed = async () => {
    if (!confirm('確定要加入大量模擬數據嗎？')) return;
    setIsSeeding(true);
    try {
      await fetch('/api/data/seed', { 
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      window.location.reload();
    } catch (e) {
      console.error(e);
      alert('Seeding 失敗');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <div className="flex gap-2 items-center">
          <Link to="/admin">
            <Button variant="outline">← 餐廳列表</Button>
          </Link>
          <h1 className="text-xl font-semibold">外賣 Dashboard</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={handleSeed} 
          disabled={isSeeding}
          className="text-xs border-dashed border-gray-300 px-2 py-1"
        >
          {isSeeding ? 'Seeding...' : '加入測試數據 (Calgary)'}
        </Button>
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <ChartWrapper title="每小時訂單 (今日)">
          {loading ? (
            <span className="text-gray-400">載入中…</span>
          ) : (
            <p className="text-3xl font-bold text-brand-600">{stats.ordersPerHour.toFixed(1)}</p>
          )}
        </ChartWrapper>
        <ChartWrapper title="每小時品項 (今日)">
          {loading ? (
            <span className="text-gray-400">載入中…</span>
          ) : (
            <p className="text-3xl font-bold text-brand-600">{stats.dishesPerHour.toFixed(1)}</p>
          )}
        </ChartWrapper>
        <ChartWrapper title="訂單完成率 (近 7 日)">
          {loading ? (
            <span className="text-gray-400">載入中…</span>
          ) : (
            <p className="text-3xl font-bold text-brand-600">{stats.completionRate.toFixed(0)}%</p>
          )}
        </ChartWrapper>
        <ChartWrapper title="平均接單時間">
          {loading ? (
            <span className="text-gray-400">載入中…</span>
          ) : (
            <p className="text-3xl font-bold text-brand-600">
              {stats.avgWait.toFixed(1)} <span className="text-sm font-normal text-gray-500">min</span>
            </p>
          )}
        </ChartWrapper>
        <ChartWrapper title="平均盈利 (近 7 日)">
          {loading ? (
            <span className="text-gray-400">載入中…</span>
          ) : (
            <p className="text-3xl font-bold text-brand-600">${stats.avgProfit.toFixed(0)}</p>
          )}
        </ChartWrapper>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 mb-8">
        <ChartWrapper title="今日訂單數">
          {loading ? (
            <span className="text-gray-400">載入中…</span>
          ) : (
            <p className="text-3xl font-bold text-brand-600">{stats.todayOrders}</p>
          )}
        </ChartWrapper>
        <ChartWrapper title="今日品項數">
          {loading ? (
            <span className="text-gray-400">載入中…</span>
          ) : (
            <p className="text-3xl font-bold text-brand-600">{stats.todayItems}</p>
          )}
        </ChartWrapper>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 mb-8">
        <ChartWrapper title="熱門品項 (Top 8)">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartWrapper>
        <ChartWrapper title="熱門配料統計 (Pizza Toppings)">
          {stats.toppingData.length > 0 ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.toppingData}
                  margin={{ left: 20, right: 30, top: 10, bottom: 10 }}
                >
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f3f4f6' }} />
                  <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={24}>
                    {stats.toppingData.map((_, index) => (
                      <Cell key={`topping-${index}`} fill={index === 0 ? '#d97706' : '#f59e0b'} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              尚無配料統計資料
            </div>
          )}
        </ChartWrapper>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">訂單密度分佈</h2>
          <div className="flex bg-gray-200 p-1 rounded-md text-sm">
            <button 
              className={`px-3 py-1 rounded-md ${densityTab === 'heatmap' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setDensityTab('heatmap')}
            >
              地圖熱圖
            </button>
            <button 
              className={`px-3 py-1 rounded-md ${densityTab === 'postal' ? 'bg-white shadow-sm' : ''}`}
              onClick={() => setDensityTab('postal')}
            >
              地區分佈 (Postal Code)
            </button>
          </div>
        </div>

        {densityTab === 'heatmap' ? (
          <ChartWrapper title="Calgary 熱圖">
            <OrderHeatmap />
            <p className="mt-2 text-xs text-gray-400 italic">
              註: 需要有效的 Google Maps API Key 以顯示熱圖。
            </p>
          </ChartWrapper>
        ) : (
          <ChartWrapper title="地區訂單數 (Postal Code)">
            {stats.postalData.length > 0 ? (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={stats.postalData}
                    margin={{ left: 10, right: 30, top: 10, bottom: 10 }}
                  >
                    <XAxis type="number" dataKey="count" hide domain={[0, 'dataMax + 1']} />
                    <YAxis 
                      dataKey="code" 
                      type="category" 
                      width={100} 
                      tick={{ fontSize: 12, fill: '#6b7280' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                      {stats.postalData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#16a34a' : '#22c55e'} opacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-gray-400">
                尚無區域資料 (請確認訂單是否已關聯使用者地址)
              </div>
            )}
          </ChartWrapper>
        )}
      </section>
    </div>
  );
}
