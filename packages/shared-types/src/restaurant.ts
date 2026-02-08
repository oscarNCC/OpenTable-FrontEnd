export interface Restaurant {
  id: string;
  name: string;
  floorplans: Floorplan[];
  menus: Menu[];
}

export interface Floorplan {
  id: string;
  name: string;
  tables: Table[];
  layout?: { x: number; y: number }[];
}

export interface Table {
  id: string;
  name: string;
  maxPeople: number;
  isEnabled: boolean;
  status: 'free' | 'occupied' | 'reserved' | 'disabled';
  revenue?: number;
  currentOrder?: Order;
  reservations?: Reservation[];
}

export interface Menu {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category?: string;
  /** Image URL or path for menu display (e.g. pizza photo) */
  image?: string;
}

export interface Order {
  id: string;
  items: { menuItemId: string; qty: number }[];
  total: number;
  diners: number;
  timestamp: string;
}

export interface Reservation {
  id: string;
  time: string;
  partySize: number;
  guestName: string;
  status: 'confirmed' | 'seated' | 'no-show';
}

export type UserRole = 'admin' | 'staff' | 'client';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  address?: string;
  postalCode?: string;
  restaurants: Restaurant[];
}

import type { PizzaOptions } from './menu';

export interface CollectDataReq {
  restaurantId?: string;
  floorplanId?: string;
  tableId: string;
  userId?: string;
  diners: number;
  items: { menuItemId: string; qty: number; pizzaOptions?: PizzaOptions }[];
  profit: number;
  startTime: string;
  endTime?: string;
}
