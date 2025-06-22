import './i18n';

import { Box } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
            <Route path="/dashboard" element={<>You are logged in</>}></Route>
            <Route path="/" element={<LoginPage />}></Route>
          </Routes>
        </Box>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
