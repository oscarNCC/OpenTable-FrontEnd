import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Card } from '@monorepo/ui';
import { updateUser } from '../../shared/api';

export function AccountSettingsPage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [postalCode, setPostalCode] = useState(user?.postalCode ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      const updatedUser = await updateUser(user.id, {
        name,
        address,
        postalCode: postalCode.toUpperCase(),
      });
      setUser(updatedUser as any);
      setMessage({ type: 'success', text: '設定已更新' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : '更新失敗' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">帳號設定</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500"
              placeholder="例如: 123 Calgary St SW"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              郵遞區號 (Postal Code)
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:ring-brand-500 focus:border-brand-500"
              placeholder="例如: T2P 2M1"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500 italic">格式: A1A 1A1 (加拿大郵編)</p>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? '儲存中...' : '儲存變更'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
