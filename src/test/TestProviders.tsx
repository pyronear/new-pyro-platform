import { ThemeProvider } from '@mui/material';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '../context/AuthProvider';
import { theme } from '../theme';

interface ProvidersProps {
  children: React.ReactNode;
}

const TestProviders = ({ children }: ProvidersProps) => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default TestProviders;
