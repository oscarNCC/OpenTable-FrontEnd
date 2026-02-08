import { Link } from 'react-router-dom';
import { Button, Card } from '@monorepo/ui';
import { useAuth } from '../../contexts/AuthContext';

export function RestaurantsPage() {
  const { user } = useAuth();
  const restaurants = user?.restaurants ?? [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">我的餐廳</h1>
        <Link to="/admin/data-preview">
          <Button variant="outline">資料預覽</Button>
        </Link>
      </header>
      {restaurants.length === 0 ? (
        <Card title="尚無餐廳">
          <p className="text-gray-500 mb-2">目前沒有綁定任何餐廳。請在 BackEnd 目錄執行 <code className="bg-gray-200 px-1 rounded">npm run db:seed</code>，會將 admin 帳號綁定到 Demo Restaurant，重新登入後即可在此選擇餐廳。</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <Card key={r.id} title={r.name} className="hover:shadow-md transition">
              <p className="text-sm text-gray-600 mb-4">外賣</p>
              <Link to={`/admin/restaurant/${r.id}`}>
                <Button>進入 Dashboard</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
