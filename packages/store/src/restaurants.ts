import { create } from 'zustand';
import type { Restaurant, Floorplan, Table, Order } from '@monorepo/shared-types';

interface RestaurantsState {
  selectedRestaurant: Restaurant | null;
  selectedFloorplan: Floorplan | null;
  selectedTable: Table | null;
  orders: Order[];
  setSelectedRestaurant: (r: Restaurant | null) => void;
  setSelectedFloorplan: (f: Floorplan | null) => void;
  setSelectedTable: (t: Table | null) => void;
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
}

export const useRestaurantsStore = create<RestaurantsState>((set) => ({
  selectedRestaurant: null,
  selectedFloorplan: null,
  selectedTable: null,
  orders: [],
  setSelectedRestaurant: (selectedRestaurant) => set({ selectedRestaurant }),
  setSelectedFloorplan: (selectedFloorplan) => set({ selectedFloorplan }),
  setSelectedTable: (selectedTable) => set({ selectedTable }),
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((s) => ({ orders: [...s.orders, order] })),
}));
