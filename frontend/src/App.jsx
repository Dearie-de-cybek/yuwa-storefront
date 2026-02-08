import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary text-primary font-sans">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="pt-32 px-6">
          <Routes>
            <Route path="/" element={
              <div className="text-center mt-20">
                <h1 className="text-4xl font-serif mb-4">Welcome to YUWA</h1>
                <p className="text-lg text-muted">Luxury African Fashion</p>
                <div className="mt-8 p-4 border border-accent inline-block text-accent">
                  If you see this, Tailwind is working.
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}