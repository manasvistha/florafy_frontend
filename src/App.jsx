import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import FlowerDetails from './pages/FlowerDetails';
import Shop from './pages/Shop';
import Wishlist from './pages/Wishlist';
import BuildBouquet from './pages/BuildBouquet';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import MyAccount from './pages/MyAccount';
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ---- Logged-in users only ---- */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/shop"
            element={
              <RequireAuth>
                <Shop />
              </RequireAuth>
            }
          />
          <Route
            path="/flower/:id"
            element={
              <RequireAuth>
                <FlowerDetails />
              </RequireAuth>
            }
          />
          <Route
            path="/wishlist"
            element={
              <RequireAuth>
                <Wishlist />
              </RequireAuth>
            }
          />
          <Route
            path="/build-bouquet"
            element={
              <RequireAuth>
                <BuildBouquet />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/my-orders"
            element={
              <RequireAuth>
                <MyOrders />
              </RequireAuth>
            }
          />
          <Route
            path="/my-account"
            element={
              <RequireAuth>
                <MyAccount />
              </RequireAuth>
            }
          />

          {/* ---- Admin (role: admin only) ---- */}
          <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
          <Route
            path="/admin/users"
            element={
              <RequireAdmin>
                <AdminUsers />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/products"
            element={
              <RequireAdmin>
                <AdminProducts />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RequireAdmin>
                <AdminOrders />
              </RequireAdmin>
            }
          />
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;