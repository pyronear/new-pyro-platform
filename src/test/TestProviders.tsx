import { ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '../context/AuthProvider';
import { PreferencesProvider } from '../context/PreferencesProvider';
import { theme } from '../theme';

interface ProvidersProps {
  children: React.ReactNode;
}

const TestProviders = ({ children }: ProvidersProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PreferencesProvider>
          <BrowserRouter>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </BrowserRouter>
        </PreferencesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default TestProviders;
