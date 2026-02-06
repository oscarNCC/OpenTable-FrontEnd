import type { Table } from '@monorepo/shared-types';

export interface TableCardProps {
  table: Table;
  onClick?: () => void;
  className?: string;
}

const statusColors: Record<Table['status'], string> = {
  free: 'bg-green-100 border-green-300',
  occupied: 'bg-amber-100 border-amber-300',
  reserved: 'bg-blue-100 border-blue-300',
  disabled: 'bg-gray-100 border-gray-300',
};

export function TableCard({ table, onClick, className = '' }: TableCardProps) {
  const color = statusColors[table.status];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={table.status === 'disabled' || !table.isEnabled}
      className={`p-4 rounded-lg border text-left transition ${color} ${className}`}
    >
      <div className="font-medium">{table.name}</div>
      <div className="text-sm text-gray-600">
        最多 {table.maxPeople} 人 · {table.status}
      </div>
      {table.revenue != null && (
        <div className="text-sm mt-1">本日營收 ${table.revenue}</div>
      )}
    </button>
  );
}
