import './i18n';

import { Box } from '@mui/material';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/Login/ProtectedRoute';
import { Topbar } from './components/Topbar/Topbar';
import { AuthProvider } from './context/AuthProvider';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Topbar />
        <Box height="calc(100vh - 64px)">
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<LoginPage />}></Route>

            {/* Routes under this cannot be accessed without being logged in */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <>
                    You are logged in and cannot access this page if not logged
                    in 🎉🎉
                  </>
                }
              ></Route>
            </Route>
          </Routes>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
