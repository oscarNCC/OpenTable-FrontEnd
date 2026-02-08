const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:3001';

function getToken(): string | null {
  return localStorage.getItem('token');
}

export async function login(email: string, password: string) {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch (err) {
    throw new Error('無法連線至後端，請確認 BackEnd 已啟動（port 3001）且 CORS 允許此網址');
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? '登入失敗');
  }
  return res.json() as Promise<{ user: { id: string; name: string; email: string; role: string; restaurants: unknown[] }; token: string }>;
}

export async function getMe() {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');
  const res = await fetch(`${API_BASE}/api/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Session invalid');
  return res.json();
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getApiBase(): string {
  return API_BASE;
}

export async function collectData(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/data/collect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });
  const dataRes = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMsg = (dataRes as { error?: string }).error ?? '送出失敗，請稍後再試';
    throw new Error(errMsg);
  }
  return dataRes as { success: boolean };
}

export function getTableIdFromContext(): string {
  if (typeof window === 'undefined') return 'guest';
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('table');
  if (fromUrl) return fromUrl;
  try {
    const fromStorage = sessionStorage.getItem('client-table');
    if (fromStorage) return fromStorage;
  } catch {
    // ignore
  }
  return 'guest';
}

export type OrderRecord = {
  id: string;
  tableId: string;
  diners: number;
  items: { menuItemId: string; qty: number; pizzaOptions?: unknown }[];
  profit: number;
  startTime: string;
  endTime?: string;
  createdAt?: string;
  status?: string;
  notes?: string;
  postalCode?: string;
  acceptedAt?: string;
};

export type OrderUpdateBody = Partial<{
  tableId: string;
  diners: number;
  items: { menuItemId: string; qty: number; pizzaOptions?: unknown }[];
  profit: number;
  startTime: string;
  endTime: string;
  status: string;
  notes: string;
}>;

export async function getHistory(params?: {
  restaurantId?: string;
  from?: string;
  to?: string;
  tableId?: string;
}): Promise<OrderRecord[]> {
  const q = new URLSearchParams();
  if (params?.restaurantId) q.set('restaurantId', params.restaurantId);
  if (params?.from) q.set('from', params.from);
  if (params?.to) q.set('to', params.to);
  if (params?.tableId) q.set('tableId', params.tableId);
  const url = `${API_BASE}/api/data/history${q.toString() ? `?${q}` : ''}`;
  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return (await res.json()) as OrderRecord[];
}

export async function getOrderById(id: string): Promise<OrderRecord> {
  const res = await fetch(`${API_BASE}/api/data/orders/${encodeURIComponent(id)}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('無法載入訂單');
  return (await res.json()) as OrderRecord;
}

export async function updateOrder(id: string, body: OrderUpdateBody): Promise<OrderRecord> {
  const res = await fetch(`${API_BASE}/api/data/orders/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('儲存失敗');
  return (await res.json()) as OrderRecord;
}

// --- Admin 帳號管理 (僅 admin 可呼叫) ---
export type UserListItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export async function getUsers(role?: 'admin' | 'staff' | 'client'): Promise<UserListItem[]> {
  const q = role ? `?role=${encodeURIComponent(role)}` : '';
  const res = await fetch(`${API_BASE}/api/users${q}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('無法載入使用者列表');
  return (await res.json()) as UserListItem[];
}

export async function createUser(body: {
  email: string;
  name: string;
  password: string;
  role: string;
}): Promise<UserListItem> {
  const res = await fetch(`${API_BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? '新增失敗');
  return data as UserListItem;
}

export async function updateUser(
  id: string,
  body: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    address?: string;
    postalCode?: string;
  }
): Promise<UserListItem> {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { error?: string }).error ?? '更新失敗');
  return data as UserListItem;
}

export async function deleteUser(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/users/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (res.status === 204) return;
  const data = await res.json().catch(() => ({}));
  throw new Error((data as { error?: string }).error ?? '刪除失敗');
}

export async function getHeatmapData(): Promise<{ lat: number; lng: number; weight: number }[]> {
  const res = await fetch(`${API_BASE}/api/data/heatmap`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) throw new Error('Failed to fetch heatmap data');
  return res.json();
}
