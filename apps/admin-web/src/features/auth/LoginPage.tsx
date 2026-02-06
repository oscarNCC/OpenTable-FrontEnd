import { Button, Card } from '@monorepo/ui';
import { useAuth } from './useAuth';

export function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card title="經理登入" className="w-full max-w-sm">
        <p className="text-gray-600 mb-4">點擊下方按鈕以 mock 登入</p>
        <Button onClick={login}>登入</Button>
      </Card>
    </div>
  );
}
