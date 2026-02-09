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
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  )
}