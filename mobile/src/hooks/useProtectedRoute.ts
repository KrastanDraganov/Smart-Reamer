import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/providers/auth/authStore';

export function useProtectedRoute() {
  const session = useAuthStore((s) => s.session);
  const isLoading = useAuthStore((s) => s.isLoading);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = (segments[0] as string) === '(auth)';

    if (!session && !inAuthGroup) {
      // Route will exist once auth screens are added
      router.replace('/(auth)/login' as never);
    } else if (session && inAuthGroup) {
      router.replace('/(main)/(tabs)');
    }
  }, [session, isLoading, segments, router]);
}
