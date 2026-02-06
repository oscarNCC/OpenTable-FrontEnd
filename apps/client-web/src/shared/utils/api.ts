import type { CollectDataReq, Table } from '@monorepo/shared-types';
import { calcTurnoverRate, calcAvgProfit, calcPopularDishesByPartySize } from '@monorepo/analytics';

const getApiBaseUrl = (): string =>
  typeof import.meta.env.VITE_API_BASE_URL === 'string' && import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')
    : 'http://localhost:3001';

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
  getHistory: async () => {
    const res = await fetch(`${getApiBaseUrl()}/api/data/history`);
    if (!res.ok) throw new Error('getHistory failed');
    return (await res.json()) as CollectDataReq[];
  },
  getAnalytics: async () => {
    const list = await api.getHistory();
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

function getTableIdFromContext(): string {
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

export { getTableIdFromContext };
