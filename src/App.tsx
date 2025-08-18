import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/500.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/open-sans-condensed/700.css';
import './i18n';
import 'leaflet/dist/leaflet.css';

import { Stack } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/Login/ProtectedRoute';
import { Topbar } from './components/Topbar/Topbar';
import { AuthProvider } from './context/AuthProvider';
import { AlertsPage } from './pages/AlertsPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { LoginPage } from './pages/LoginPage';

export const DEFAULT_ROUTE = '/alerts';
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Stack height={'100vh'}>
            <Topbar />
            <Stack overflow={'hidden'} flexGrow={1}>
              <Routes>
                <Route index element={<Navigate to={DEFAULT_ROUTE} />} />
                <Route path="/login" element={<LoginPage />}></Route>

                {/* Routes under this cannot be accessed without being logged in */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/alerts" element={<AlertsPage />}></Route>
                  <Route path="/dashboard" element={<DashboardPage />}></Route>
                  <Route path="/history" element={<HistoryPage />}></Route>
                </Route>
              </Routes>
            </Stack>
          </Stack>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
