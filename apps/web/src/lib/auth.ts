import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@applytrack/shared';
import { apiClient } from './api';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setAccessToken: (token) => {
        set({ accessToken: token });
        apiClient.setAccessToken(token);
      },

      logout: async () => {
        try {
          await apiClient.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ user: null, isAuthenticated: false });
          apiClient.setAccessToken(null);
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          // Try to refresh token
          const response = await apiClient.refresh();
          set({ 
            user: response.user, 
            isAuthenticated: true,
            accessToken: response.accessToken 
          });
          apiClient.setAccessToken(response.accessToken);
        } catch (error) {
          console.error('Auth check failed:', error);
          set({ user: null, isAuthenticated: false, accessToken: null });
          apiClient.setAccessToken(null);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
      onRehydrateStorage: () => (state) => {
        // Restore access token to API client when store rehydrates
        if (state?.accessToken) {
          apiClient.setAccessToken(state.accessToken);
        }
      },
    }
  )
);
