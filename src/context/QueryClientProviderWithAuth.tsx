// MyQueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuth } from './useAuth';

const baseUrl = import.meta.env.VITE_API_URL;

export const QueryClientProviderWithAuth = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token } = useAuth();

  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          // Added trailing comma so typescript understands this generic is not TSX syntax
          queryFn: async <T,>({
            queryKey,
          }: {
            queryKey: readonly unknown[];
          }): Promise<T> => {
            if (typeof queryKey[0] !== 'string') {
              throw new Error(
                `queryKey should be an array of strings, current value is ${JSON.stringify(queryKey)}`
              );
            }
            const url = queryKey.join('');
            const res = await fetch(`${baseUrl}/${url}`, {
              headers: {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
              },
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json() as Promise<T>;
          },
        },
      },
    });
  }, [token]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
