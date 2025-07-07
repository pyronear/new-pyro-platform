import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './i18n';

import { Box } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Topbar } from './components/Topbar/Topbar';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Topbar />
      <Box height="calc(100vh - 64px)">
        <Routes>
          <Route path="/about" element={<>This is the about page</>}></Route>
          <Route path="/" element={<LoginPage />}></Route>
        </Routes>
      </Box>
    </BrowserRouter>
  );
}

export default App;
