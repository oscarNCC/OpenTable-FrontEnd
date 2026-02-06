import { useState } from 'react';
import type { User } from '@monorepo/shared-types';
import { api } from '../../shared/utils/api';

function getStoredUser(): User | null {
  const stored = sessionStorage.getItem('admin-user');
  if (!stored) return null;
  try {
    return JSON.parse(stored) as User;
  } catch {
    sessionStorage.removeItem('admin-user');
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const loading = false;

  const login = async () => {
    const u = await api.getCurrentUser();
    setUser(u);
    sessionStorage.setItem('admin-user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('admin-user');
  };

  return { user, loading, login, logout };
}
