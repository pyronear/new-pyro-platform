import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { Container } from '@mui/material';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Container maxWidth="sm">
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </div>

        <Routes>
          <Route path="/about" element={<>This is the about page</>}></Route>
          <Route path="/" element={<>Welcome to pyronear 2.0</>}></Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
