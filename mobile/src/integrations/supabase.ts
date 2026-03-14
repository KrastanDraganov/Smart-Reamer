import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createMMKV } from 'react-native-mmkv';
import { env } from '@/config/env';

let supabase: SupabaseClient;

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

if (env.supabaseUrl && env.supabaseAnonKey && isValidUrl(env.supabaseUrl)) {
  const supabaseStorage = createMMKV({ id: 'supabase-auth' });

  const supabaseStorageAdapter = {
    getItem: (key: string) => supabaseStorage.getString(key) ?? null,
    setItem: (key: string, value: string) => supabaseStorage.set(key, value),
    removeItem: (key: string) => {
      supabaseStorage.remove(key);
    },
  };

  supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      storage: supabaseStorageAdapter,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
} else {
  if (__DEV__) {
    console.warn(
      '[Supabase] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHED_KEY. ' +
        'Supabase features will not work. Add these to your .env file.'
    );
  }
  // Create a minimal stub so imports don't crash
  supabase = null as unknown as SupabaseClient;
}

export { supabase };
