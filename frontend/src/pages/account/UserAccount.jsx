import { useAuth } from '../../context/AuthContext';

export default function UserAccount() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen pt-32 px-6 bg-secondary">
      <div className="max-w-250 mx-auto">
        <h1 className="font-serif text-4xl mb-2">My Atelier</h1>
        <p className="text-muted mb-10">Welcome back, {user?.name}</p>
        
        <button onClick={logout} className="px-6 py-3 border border-primary text-primary uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-colors">
          Sign Out
        </button>
      </div>
    </div>
  );
}