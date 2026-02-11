import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { toast } from 'sonner'; 
import { ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.success) {
      toast.success(`Welcome back.`);
      
      // THE SMART REDIRECT LOGIC
      if (result.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/account');
      }
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-6">
      <div className="w-full max-w-md bg-white p-10 shadow-2xl border border-border/50 relative overflow-hidden">
        
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />

        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl mb-2">Access Account</h2>
          <p className="text-muted text-sm uppercase tracking-widest">Identify Yourself</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full border-b border-gray-300 py-3 focus:border-primary focus:outline-none bg-transparent transition-colors font-serif text-lg"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted">Password</label>
              <Link to="/forgot-password" className="text-xs text-gray-400...">Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              required
              className="w-full border-b border-gray-300 py-3 focus:border-primary focus:outline-none bg-transparent transition-colors font-serif text-lg"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 uppercase tracking-widest text-xs hover:bg-accent transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border pt-6">
          <p className="text-sm text-muted mb-4">New to YUWA?</p>
          <Link to="/register" className="inline-block border border-primary text-primary px-8 py-3 uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-colors">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}