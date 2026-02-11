import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen pt-32 px-6 bg-gray-50">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-serif text-4xl">Command Center</h1>
          <button onClick={logout} className="text-sm text-red-500 underline">Log Out</button>
        </div>
        <div className="bg-white p-8 shadow-sm border border-gray-200">
          <p>Welcome, Admin <strong>{user?.name}</strong>.</p>
          <p className="text-sm text-gray-500 mt-2">Access Level: GOD MODE</p>
        </div>
      </div>
    </div>
  );
}