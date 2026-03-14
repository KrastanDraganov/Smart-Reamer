// TODO: Implement your auth service functions here
// This file provides the API for authentication operations.
//
// Example with Supabase:
//   import { supabase } from '@/integrations/supabase';
//   export async function login({ email, password }) { ... }
//
// Example with custom API:
//   import { api } from '@/services/api';
//   export async function login({ email, password }) { ... }

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  email: string;
  password: string;
  username?: string;
}

export async function login(_params: LoginParams) {
  // TODO: Implement login
  throw new Error('Auth not configured. See docs/MIGRATION.md for setup instructions.');
}

export async function register(_params: RegisterParams) {
  // TODO: Implement registration
  throw new Error('Auth not configured. See docs/MIGRATION.md for setup instructions.');
}

export async function logout() {
  // TODO: Implement logout
}

export async function getSession() {
  // TODO: Implement session retrieval
  return { session: null };
}
