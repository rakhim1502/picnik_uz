import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import About from './pages/About';
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

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Page transition variantlari
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.4, 0.25, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.4, 0.25, 1]
    }
  }
};

// AnimatedPage wrapper komponenti
const AnimatedPage = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Ochiq sahifalar */}
        <Route path="/" element={
          <AnimatedPage><Home /></AnimatedPage>
        } />
        <Route path="/shop" element={
          <AnimatedPage><Shop /></AnimatedPage>
        } />
        <Route path="/product/:slug" element={
          <AnimatedPage><ProductDetail /></AnimatedPage>
        } />
        <Route path="/cart" element={
          <AnimatedPage><Cart /></AnimatedPage>
        } />
        <Route path="/login" element={
          <AnimatedPage><Login /></AnimatedPage>
        } />
        <Route path="/register" element={
          <AnimatedPage><Register /></AnimatedPage>
        } />
        <Route path="/about" element={
          <AnimatedPage><About /></AnimatedPage>
        } />
        <Route path="/profile" element={
          <AnimatedPage>
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          </AnimatedPage>
        } />

        {/* Admin */}
        <Route path="/admin/login" element={
          <AnimatedPage><AdminLogin /></AnimatedPage>
        } />
        <Route path="/admin" element={
          <AnimatedPage>
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          </AnimatedPage>
        }>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* Wishlist */}
        <Route path="/wishlist" element={
          <AnimatedPage>
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          </AnimatedPage>
        } />

        {/* Order Tracking */}
        <Route path="/order-tracking" element={
          <AnimatedPage><OrderTracking /></AnimatedPage>
        } />

        {/* 404 */}
        <Route path="*" element={
          <AnimatedPage><NotFound /></AnimatedPage>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;