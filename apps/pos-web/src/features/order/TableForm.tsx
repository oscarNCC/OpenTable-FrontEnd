import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { CollectDataReq, Table } from '@monorepo/shared-types';
import { Button } from '@monorepo/ui';
import { api } from '../../shared/utils/api';
import { MENU_ITEMS, MENU_CATEGORIES, MENU_BY_CATEGORY } from '../../data/menu';

const schema = z.object({
  tableId: z.string().min(1, '請選擇枱號'),
  diners: z.number().min(1, '至少 1 人').max(20, '最多 20 人'),
  startTime: z.string().min(1, '請選擇時間'),
  items: z
    .array(
      z.object({
        menuItemId: z.string(),
        qty: z.number().min(0),
      })
    )
    .refine((arr) => arr.some((i) => i.qty > 0), '請至少選擇一道菜'),
});

type FormValues = z.infer<typeof schema>;

const MOCK_TABLES: Table[] = [
  { id: 't1', name: '1 號枱', maxPeople: 2, isEnabled: true, status: 'free' },
  { id: 't2', name: '2 號枱', maxPeople: 4, isEnabled: true, status: 'free' },
  { id: 't3', name: '3 號枱', maxPeople: 6, isEnabled: true, status: 'free' },
];

const menuIdToIndex = Object.fromEntries(MENU_ITEMS.map((m, i) => [m.id, i]));

export interface TableFormProps {
  onSuccess?: () => void;
}

export function TableForm({ onSuccess }: TableFormProps) {
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0] ?? '');
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tableId: '',
      diners: 2,
      startTime: new Date().toISOString().slice(0, 16),
      items: MENU_ITEMS.map((item) => ({ menuItemId: item.id, qty: 0 })),
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- watch() from RHF
  const items = watch('items');

  const setQty = (menuItemId: string, delta: number) => {
    const idx = menuIdToIndex[menuItemId];
    if (idx == null) return;
    const next = [...items];
    const cur = next[idx]?.qty ?? 0;
    next[idx] = { menuItemId, qty: Math.max(0, cur + delta) };
    setValue('items', next);
  };

  const getQty = (menuItemId: string) => {
    const idx = menuIdToIndex[menuItemId];
    return idx != null ? (items[idx]?.qty ?? 0) : 0;
  };

  const onSubmit = async (data: FormValues) => {
    const withQty = data.items.filter((i) => i.qty > 0);
    const menuMap = Object.fromEntries(MENU_ITEMS.map((m) => [m.id, m]));
    const total = withQty.reduce((sum, i) => sum + (menuMap[i.menuItemId]?.price ?? 0) * i.qty, 0);
    const profit = Math.round(total * 0.3);
    const payload: CollectDataReq = {
      tableId: data.tableId,
      diners: data.diners,
      items: withQty,
      profit,
      startTime: data.startTime,
    };
    await api.collectData(payload);
    onSuccess?.();
  };

  const categoryItems = activeCategory ? MENU_BY_CATEGORY[activeCategory] ?? [] : [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="table-form">
      <div>
        <label>枱號</label>
        <select {...register('tableId')}>
          <option value="">請選擇</option>
          {MOCK_TABLES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        {errors.tableId && <span className="error">{errors.tableId.message}</span>}
      </div>
      <div>
        <label>人數</label>
        <input type="number" {...register('diners', { valueAsNumber: true })} min={1} max={20} />
        {errors.diners && <span className="error">{errors.diners.message}</span>}
      </div>
      <div>
        <label>開始時間</label>
        <input type="datetime-local" {...register('startTime')} />
        {errors.startTime && <span className="error">{errors.startTime.message}</span>}
      </div>

      <div className="menu-tabs">
        <div className="menu-tab-list" role="tablist">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`menu-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="menu-tab-content" role="tabpanel">
          {categoryItems.map((item) => {
            const qty = getQty(item.id);
            return (
              <div key={item.id} className="menu-row">
                <span className="menu-row-name">
                  {item.name}（${item.price}）
                </span>
                <div className="menu-row-controls">
                  <button
                    type="button"
                    className="menu-qty-btn"
                    aria-label="減少"
                    onClick={() => setQty(item.id, -1)}
                    disabled={qty <= 0}
                  >
                    −
                  </button>
                  <span className="menu-qty-value">{qty}</span>
                  <button
                    type="button"
                    className="menu-qty-btn"
                    aria-label="增加"
                    onClick={() => setQty(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {errors.items && <span className="error">{errors.items.message}</span>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '送出中…' : '送出'}
      </Button>
    </form>
  );
}
