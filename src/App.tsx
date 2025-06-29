import './i18n';

import { Box } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/Login/ProtecteRoute';
import { Topbar } from './components/Topbar/Topbar';
import { AuthProvider } from './context/AuthProvider';
import { QueryClientProviderWithAuth } from './context/QueryClientProviderWithAuth';
import { AlertsPage } from './pages/AlertsPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <QueryClientProviderWithAuth>
        <BrowserRouter>
          <Topbar />
          <Box height="calc(100vh - 64px)">
            <Routes>
              <Route path="/" element={<Navigate replace to="/login" />} />
              <Route path="/login" element={<LoginPage />}></Route>

              {/* Routes under this cannot be accessed without being logged in */}
              <Route element={<ProtectedRoute />}>
                <Route path="/alerts" element={<AlertsPage />}></Route>
              </Route>
            </Routes>
          </Box>
        </BrowserRouter>
      </QueryClientProviderWithAuth>
    </AuthProvider>
  );
}

export default App;
