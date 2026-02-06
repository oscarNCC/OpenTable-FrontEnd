import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { Card, Button } from '@monorepo/ui';

export function RestaurantsPage() {
  const { user, logout } = useAuth();
  const restaurants = user?.restaurants ?? [];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">我的餐廳</h1>
        <div className="flex gap-2">
          <Link to="/data-preview">
            <Button variant="outline">資料預覽</Button>
          </Link>
          <Button variant="secondary" onClick={logout}>
            登出
          </Button>
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((r) => (
          <Card key={r.id} title={r.name} className="hover:shadow-md transition">
            <p className="text-sm text-gray-600 mb-4">
              {r.floorplans?.length ?? 0} 個樓面
            </p>
            <Link to={`/restaurant/${r.id}`}>
              <Button>進入 Dashboard</Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
