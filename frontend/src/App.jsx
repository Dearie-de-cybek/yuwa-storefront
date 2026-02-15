import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import CartDrawer from './components/checkout/CartDrawer';

// Pages
import HomePage from './pages/home/HomePage';
import Shop from './pages/shop/Shop';
import ProductDetails from './pages/product/ProductDetails';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import PromotionsPage from './pages/admin/PromotionsPage';
import UserAccount from './pages/account/UserAccount';
import ProductsPage from './pages/admin/ProductsPage';
import OrdersPage from './pages/admin/OrdersPage';
import CustomersPage from './pages/admin/CustomersPage';
import SettingsPage from './pages/admin/SettingsPage';
import ProductEditPage from './pages/admin/ProductEditPage';

// Auth
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center">Loading Access...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/account" replace />;
  return children;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary text-primary font-sans flex flex-col">
        <Toaster position="top-center" richColors />
        <CartDrawer />

        <Routes>
          {/* --- 1. PUBLIC ROUTES (Have Navbar & Footer) --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop/ready-to-wear" element={<Shop />} />
            <Route path="/shop/bubus" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/account" element={<ProtectedRoute><UserAccount /></ProtectedRoute>} />
          </Route>

          {/* --- 2. AUTH ROUTES (Stand-alone, No Navbar) --- */}
          <Route path="/login" element={<LoginPage />} />

          {/* --- 3. ADMIN ROUTES (Uses AdminLayout internally) --- */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute roleRequired="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/promotions" 
            element={
              <ProtectedRoute roleRequired="ADMIN">
                <PromotionsPage />
              </ProtectedRoute>
            } 
          />

          <Route path="/admin/products" element={<ProtectedRoute roleRequired="ADMIN"><ProductsPage /></ProtectedRoute>} />
<Route path="/admin/orders" element={<ProtectedRoute roleRequired="ADMIN"><OrdersPage /></ProtectedRoute>} />
<Route path="/admin/customers" element={<ProtectedRoute roleRequired="ADMIN"><CustomersPage /></ProtectedRoute>} />
<Route path="/admin/settings" element={<ProtectedRoute roleRequired="ADMIN"><SettingsPage /></ProtectedRoute>} />
<Route 
  path="/admin/product/:id/edit" 
  element={
    <ProtectedRoute roleRequired="ADMIN">
      <ProductEditPage />
    </ProtectedRoute>
  } 
/>
          
        </Routes>
      </div>
    </Router>
  );
}