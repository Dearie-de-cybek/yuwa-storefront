import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import CustomLanding from './pages/custom/CustomLanding'; 
import BookConsultation from './pages/custom/BookConsultation';
import Shop from './pages/shop/Shop';
import CartDrawer from './components/checkout/CartDrawer';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary text-primary font-sans">
        <Navbar />
        <CartDrawer />
        
        <main>
          <Routes>
            <Route path="/" element={
              <div className="pt-40 text-center">
                <h1 className="text-4xl font-serif">Home Page Placeholder</h1>
                <p className="mt-4">Go to "Custom Creations" in the menu.</p>
              </div>
            } />
            
            {/* The New Custom Creations Route */}
            <Route path="/custom" element={<CustomLanding />} />
            <Route path="/book-consultation" element={<BookConsultation />} />
            <Route path="/shop/ready-to-wear" element={<Shop />} />
            <Route path="/shop/bubus" element={<Shop />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}