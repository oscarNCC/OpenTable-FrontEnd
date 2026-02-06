import type { CollectDataReq, Table } from '@monorepo/shared-types';

/**
 * 返桌率：給定時間段內，每張枱平均被使用次數
 * slot 格式建議 "YYYY-MM-DD" 或 "YYYY-MM-DDTHH" 等
 */
export function calcTurnoverRate(
  records: CollectDataReq[],
  tables: Table[],
  slot: string
): number {
  const slotStart = new Date(slot).getTime();
  const slotEnd = slotStart + 24 * 60 * 60 * 1000;
  const inSlot = records.filter((r) => {
    const t = new Date(r.startTime).getTime();
    return t >= slotStart && t < slotEnd;
  });
  const tableIds = new Set(tables.map((t) => t.id));
  const usageByTable = new Map<string, number>();
  tableIds.forEach((id) => usageByTable.set(id, 0));
  inSlot.forEach((r) => {
    if (tableIds.has(r.tableId)) {
      usageByTable.set(r.tableId, (usageByTable.get(r.tableId) ?? 0) + 1);
    }
  });
  const totalUsage = [...usageByTable.values()].reduce((a, b) => a + b, 0);
  const tableCount = tableIds.size || 1;
  return totalUsage / tableCount;
}
