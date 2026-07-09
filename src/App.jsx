import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/shop" element={<LoginPage />} />
        <Route path="/build-bouquet" element={<LoginPage />} />
        <Route path="/my-account" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;