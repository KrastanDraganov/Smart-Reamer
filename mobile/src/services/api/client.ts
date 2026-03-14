import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/providers/auth/authStore';

interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const session = useAuthStore.getState().session;
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (__DEV__) {
      console.error(
        `[API] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        error.response?.status,
        error.response?.data
      );
    }

    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

export { api };
