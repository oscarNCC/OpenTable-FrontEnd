import type { CollectDataReq } from '@monorepo/shared-types';

export interface PopularByPartySize {
  solo: { menuItemId: string; qty: number }[];
  group: { menuItemId: string; qty: number }[];
}

/**
 * 依人數區分：1 人 vs 多人，各取熱門菜（依數量排序）
 */
export function calcPopularDishesByPartySize(
  records: CollectDataReq[]
): PopularByPartySize {
  const solo: Record<string, number> = {};
  const group: Record<string, number> = {};
  for (const r of records) {
    const target = r.diners === 1 ? solo : group;
    for (const item of r.items) {
      target[item.menuItemId] = (target[item.menuItemId] ?? 0) + item.qty;
    }
  }
  const toSorted = (o: Record<string, number>) =>
    Object.entries(o)
      .map(([menuItemId, qty]) => ({ menuItemId, qty }))
      .sort((a, b) => b.qty - a.qty);
  return {
    solo: toSorted(solo),
    group: toSorted(group),
  };
}

/**
 * 平均盈利（依 records 平均）
 */
export function calcAvgProfit(records: CollectDataReq[]): number {
  if (records.length === 0) return 0;
  const total = records.reduce((sum, r) => sum + r.profit, 0);
  return total / records.length;
}
