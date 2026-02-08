import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@monorepo/ui';
import { useAuth } from '../../contexts/AuthContext';

const ROLE_ROUTES: Record<string, string> = {
  admin: '/admin',
  staff: '/pos',
  client: '/client',
};

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const u = await login(email, password);
      const route = ROLE_ROUTES[u.role] ?? '/';
      navigate(route, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登入失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    const route = ROLE_ROUTES[user.role] ?? '/';
    navigate(route, { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card title="登入" className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">帳號 (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={submitting}>
            {submitting ? '登入中…' : '登入'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
