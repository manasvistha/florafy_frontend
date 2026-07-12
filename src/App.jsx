import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import FlowerDetails from './pages/FlowerDetails';
import Shop from './pages/Shop';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flower/:id" element={<FlowerDetails />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/build-bouquet" element={<LoginPage />} />
        <Route path="/my-account" element={<LoginPage />} />
        <Route path="/my-orders" element={<LoginPage />} />
        <Route path="/wishlist" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;