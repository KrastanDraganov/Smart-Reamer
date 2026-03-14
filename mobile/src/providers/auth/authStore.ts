import { useEffect } from 'react';
import { create } from 'zustand';

interface AuthUser {
  id: string;
  email: string;
  [key: string]: unknown;
}

interface AuthSession {
  access_token: string;
  refresh_token: string;
  [key: string]: unknown;
}

interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  setSession: (session: AuthSession | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearSession: () => void;
  initialize: () => Promise<void>;
  cleanup: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setSession: (session) => set({ session }),

  setLoading: (isLoading) => set({ isLoading }),

  clearSession: () => set({ user: null, session: null, isAuthenticated: false }),

  initialize: async () => {
    // TODO: Add your auth initialization logic here
    // Example: Check for existing session, set up auth state listener
    set({ isLoading: false });
  },

  cleanup: () => {
    // TODO: Clean up auth subscriptions here
  },
}));

export function useAuthInit() {
  const initialize = useAuthStore((s) => s.initialize);
  const cleanup = useAuthStore((s) => s.cleanup);

  useEffect(() => {
    initialize();
    return () => cleanup();
  }, [initialize, cleanup]);
}
