import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import { toast } from 'sonner'; 
import { ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await register(
      formData.firstName, 
      formData.lastName, 
      formData.email, 
      formData.password
    );

    if (result.success) {
      toast.success("Welcome to YUWA.");
      navigate('/account'); // Auto-redirect to dashboard
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-6 py-12">
      <div className="w-full max-w-md bg-white p-10 shadow-2xl border border-border/50 relative overflow-hidden">
        
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-black" />

        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl mb-2">Join the Atelier</h2>
          <p className="text-muted text-sm uppercase tracking-widest">Create your profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">First Name</label>
              <input 
                name="firstName"
                required
                className="w-full border-b border-gray-300 py-3 focus:border-primary focus:outline-none bg-transparent transition-colors font-serif text-lg"
                placeholder="Amaka"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Last Name</label>
              <input 
                name="lastName"
                required
                className="w-full border-b border-gray-300 py-3 focus:border-primary focus:outline-none bg-transparent transition-colors font-serif text-lg"
                placeholder="Obi"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Email Address</label>
            <input 
              name="email"
              type="email" 
              required
              className="w-full border-b border-gray-300 py-3 focus:border-primary focus:outline-none bg-transparent transition-colors font-serif text-lg"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Password</label>
            <input 
              name="password"
              type="password" 
              required
              className="w-full border-b border-gray-300 py-3 focus:border-primary focus:outline-none bg-transparent transition-colors font-serif text-lg"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-black text-white py-4 uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 mt-8 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border pt-6">
          <p className="text-sm text-muted mb-4">Already have an account?</p>
          <Link to="/login" className="inline-block text-black font-bold uppercase tracking-widest text-xs hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}