import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import CustomLanding from './pages/custom/CustomLanding'; 
import BookConsultation from './pages/custom/BookConsultation';
import Shop from './pages/shop/Shop';
import { Toaster } from 'sonner';
import CartDrawer from './components/checkout/CartDrawer';
import ProductDetails from './pages/product/ProductDetails';
import Checkout from './pages/checkout/Checkout';
import HomePage from './pages/home/HomePage'; 
import Footer from './components/layout/Footer';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserAccount from './pages/account/UserAccount';

// --- PROTECTED ROUTE COMPONENT ---
const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();

  // 1. Still checking if user is logged in? Show nothing (or a spinner)
  if (loading) return null; 

  // 2. No user? Kick them to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. User is here, but are they allowed? (e.g. Customer trying to access Admin)
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/account" replace />; // Redirect to their own dashboard
  }

  // 4. Allowed! Render the page.
  return children;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary text-primary font-sans">
        <Toaster position="top-center" richColors />
        <Navbar />
        <CartDrawer />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* The Custom Creations Route */}
            <Route path="/custom" element={<CustomLanding />} />
            <Route path="/book-consultation" element={<BookConsultation />} />
            <Route path="/shop/ready-to-wear" element={<Shop />} />
            <Route path="/shop/bubus" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/login" element={<LoginPage />} />
        
        {/* Protected User Route */}
        <Route path="/account" element={
          <ProtectedRoute>
            <UserAccount />
          </ProtectedRoute>
        } />

        {/* Protected Admin Route */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute roleRequired="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}