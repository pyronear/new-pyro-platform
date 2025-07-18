import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './i18n';

import { Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/Login/ProtectedRoute';
import { Topbar } from './components/Topbar/Topbar';
import { AuthProvider } from './context/AuthProvider';
import { AlertsPage } from './pages/AlertsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';

export const DEFAULT_ROUTE = '/dashboard';
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Topbar />
          <Box height="calc(100vh - 64px)">
            <Routes>
              <Route index element={<Navigate to={DEFAULT_ROUTE} />} />
              <Route path="/login" element={<LoginPage />}></Route>

              {/* Routes under this cannot be accessed without being logged in */}
              <Route element={<ProtectedRoute />}>
                <Route path="/alerts" element={<AlertsPage />}></Route>
                <Route path="/dashboard" element={<DashboardPage />}></Route>
              </Route>
            </Routes>
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
