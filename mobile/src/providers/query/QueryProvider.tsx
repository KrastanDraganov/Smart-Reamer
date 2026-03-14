import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '@/utils/toast';
import { mmkvPersister } from './mmkvPersister';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const { t } = useTranslation();

  const handleError = useCallback(
    (error: Error) => {
      toast.error(error.message || t('errors.generic'), {
        title: t('errors.title'),
      });
    },
    [t]
  );

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 60 * 24,
            retry: 2,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
        queryCache: new QueryCache({
          onError: handleError,
        }),
        mutationCache: new MutationCache({
          onError: handleError,
        }),
      }),
    [handleError]
  );

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: mmkvPersister }}>
      {children}
    </PersistQueryClientProvider>
  );
}
