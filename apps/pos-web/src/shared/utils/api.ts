import type { CollectDataReq, Table } from '@monorepo/shared-types';
import { calcTurnoverRate, calcAvgProfit, calcPopularDishesByPartySize } from '@monorepo/analytics';

const getApiBaseUrl = (): string =>
  typeof import.meta.env.VITE_API_BASE_URL === 'string' && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
    : 'http://localhost:3001';

export type OrderRecord = CollectDataReq & {
  id: string;
  createdAt?: string;
  status?: string;
  notes?: string;
};

export type OrderUpdateBody = Partial<CollectDataReq> & { status?: string; notes?: string };

export const api = {
  collectData: async (data: CollectDataReq) => {
    const res = await fetch(`${getApiBaseUrl()}/api/data/collect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('collect failed');
    const json = (await res.json()) as { success: boolean };
    return json;
  },
  getHistory: async (params?: { restaurantId?: string; from?: string; to?: string; tableId?: string }) => {
    const q = new URLSearchParams();
    if (params?.restaurantId) q.set('restaurantId', params.restaurantId);
    if (params?.from) q.set('from', params.from);
    if (params?.to) q.set('to', params.to);
    if (params?.tableId) q.set('tableId', params.tableId);
    const url = `${getApiBaseUrl()}/api/data/history${q.toString() ? `?${q}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('getHistory failed');
    return (await res.json()) as OrderRecord[];
  },
  getOrderById: async (id: string): Promise<OrderRecord> => {
    const res = await fetch(`${getApiBaseUrl()}/api/data/orders/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('getOrderById failed');
    return (await res.json()) as OrderRecord;
  },
  updateOrder: async (id: string, body: OrderUpdateBody): Promise<OrderRecord> => {
    const res = await fetch(`${getApiBaseUrl()}/api/data/orders/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('updateOrder failed');
    return (await res.json()) as OrderRecord;
  },
  getAnalytics: async (params?: { restaurantId?: string; from?: string; to?: string }) => {
    const list = await api.getHistory(params);
    const MOCK_TABLES: Table[] = [
      { id: 't1', name: '1 號枱', maxPeople: 2, isEnabled: true, status: 'free' },
      { id: 't2', name: '2 號枱', maxPeople: 4, isEnabled: true, status: 'free' },
      { id: 't3', name: '3 號枱', maxPeople: 6, isEnabled: true, status: 'free' },
    ];
    const today = new Date().toISOString().slice(0, 10);
    return {
      turnoverRate: calcTurnoverRate(list, MOCK_TABLES, today),
      avgProfit: calcAvgProfit(list),
      popularByPartySize: calcPopularDishesByPartySize(list),
    };
  },
};
