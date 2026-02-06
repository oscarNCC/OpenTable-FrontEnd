import type { CollectDataReq, Table } from '@monorepo/shared-types';
import { calcTurnoverRate, calcAvgProfit, calcPopularDishesByPartySize } from '@monorepo/analytics';

const MOCK_RECORDS: CollectDataReq[] = [];
const MOCK_TABLES: Table[] = [
  { id: 't1', name: '1 號枱', maxPeople: 2, isEnabled: true, status: 'free' },
  { id: 't2', name: '2 號枱', maxPeople: 4, isEnabled: true, status: 'free' },
  { id: 't3', name: '3 號枱', maxPeople: 6, isEnabled: true, status: 'free' },
];

export const api = {
  collectData: async (data: CollectDataReq) => {
    MOCK_RECORDS.push(data);
    return { success: true };
  },
  getHistory: async () => [...MOCK_RECORDS],
  getAnalytics: async () => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      turnoverRate: calcTurnoverRate(MOCK_RECORDS, MOCK_TABLES, today),
      avgProfit: calcAvgProfit(MOCK_RECORDS),
      popularByPartySize: calcPopularDishesByPartySize(MOCK_RECORDS),
    };
  },
  getCurrentUser: async () => {
    return {
      id: 'u1',
      name: '經理',
      email: 'manager@example.com',
      restaurants: [
        {
          id: 'r1',
          name: '本店',
          floorplans: [
            {
              id: 'f1',
              name: 'Main Floor',
              tables: MOCK_TABLES,
            },
          ],
          menus: [],
        },
      ],
    };
  },
};
