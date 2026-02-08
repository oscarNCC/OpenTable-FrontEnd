import { useState, useEffect, useCallback } from 'react';
import { Button, Card } from '@monorepo/ui';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  type UserListItem,
} from '../../shared/api';

type RoleFilter = 'all' | 'admin' | 'staff' | 'client';

export function AccountManagementPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editingUser, setEditingUser] = useState<UserListItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<UserListItem | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' as string });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const role = roleFilter === 'all' ? undefined : roleFilter;
      const list = await getUsers(role);
      setUsers(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : '載入失敗');
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openAdd = () => {
    setForm({ name: '', email: '', password: '', role: 'staff' });
    setEditingUser(null);
    setModal('add');
    setSubmitError(null);
  };

  const openEdit = (u: UserListItem) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setEditingUser(u);
    setModal('edit');
    setSubmitError(null);
  };

  const closeModal = () => {
    setModal(null);
    setEditingUser(null);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      if (modal === 'add') {
        await createUser({
          email: form.email,
          name: form.name,
          password: form.password,
          role: form.role,
        });
      } else if (modal === 'edit' && editingUser) {
        await updateUser(editingUser.id, {
          name: form.name,
          email: form.email,
          role: form.role,
          ...(form.password ? { password: form.password } : {}),
        });
      }
      closeModal();
      loadUsers();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : '操作失敗');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setSubmitting(true);
    setError(null);
    try {
      await deleteUser(deleteConfirm.id);
      setDeleteConfirm(null);
      loadUsers();
    } catch (e) {
      setError(e instanceof Error ? e.message : '刪除失敗');
    } finally {
      setSubmitting(false);
    }
  };

  const roleLabel: Record<string, string> = {
    admin: '管理員',
    staff: '員工',
    client: '客戶',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">帳號管理</h1>
        <Button onClick={openAdd}>新增帳號</Button>
      </header>

      <div className="flex gap-2 mb-4">
        {(['all', 'admin', 'staff', 'client'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded text-sm ${
              roleFilter === r
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {r === 'all' ? '全部' : roleLabel[r]}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">載入中…</p>
      ) : (
        <Card title={`使用者列表 (${users.length})`}>
          {users.length === 0 ? (
            <p className="text-gray-500">尚無符合條件的帳號</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 pr-4">姓名</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">角色</th>
                    <th className="py-2 pr-4">建立時間</th>
                    <th className="py-2">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-2 pr-4">{u.name}</td>
                      <td className="py-2 pr-4">{u.email}</td>
                      <td className="py-2 pr-4">{roleLabel[u.role] ?? u.role}</td>
                      <td className="py-2 pr-4 text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleString('zh-TW')}
                      </td>
                      <td className="py-2">
                        <Button
                          variant="outline"
                          className="mr-2"
                          onClick={() => openEdit(u)}
                        >
                          編輯
                        </Button>
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => setDeleteConfirm(u)}
                        >
                          刪除
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* 新增/編輯 Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4">
              {modal === 'add' ? '新增帳號' : '編輯帳號'}
            </h2>
            <form onSubmit={handleSubmit}>
              {submitError && (
                <p className="text-red-600 text-sm mb-2">{submitError}</p>
              )}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">姓名</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    密碼 {modal === 'edit' && '(留空則不變更)'}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                    required={modal === 'add'}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">角色</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="admin">管理員</option>
                    <option value="staff">員工</option>
                    <option value="client">客戶</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={closeModal}>
                  取消
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? '處理中…' : modal === 'add' ? '新增' : '儲存'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 刪除確認 */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold mb-2">確認刪除</h2>
            <p className="text-gray-600 mb-4">
              確定要刪除「{deleteConfirm.name}」（{deleteConfirm.email}）嗎？此操作無法復原。
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                disabled={submitting}
              >
                取消
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? '刪除中…' : '刪除'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
