import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import './App.css';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import { ToastProvider } from './context/ToastContext';

// Mijoz sahifalari
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import About from './pages/About'; // ← YANGI
import OrderTracking from './pages/OrderTracking';

// Admin sahifalari
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminProducts from './pages/admin/Products';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('piknic_token');
  const user = JSON.parse(localStorage.getItem('piknic_user') || 'null');

  console.log('ProtectedRoute check:', {
    hasToken: !!token,
    user,
    adminOnly,
    isAdmin: user?.isAdmin
  });

  if (!token) {
    console.log('Token yo\'q, login ga yo\'naltirilmoqda');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user?.isAdmin) {
    console.log('Admin emas, bosh sahifaga yo\'naltirilmoqda');
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              {/* Ochiq sahifalar */}
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} /> // ← YANGI
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Admin */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
              </Route>
              {/* Wishlist */}
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
              <Route path="/order-tracking" element={
                <OrderTracking />
              } />
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;