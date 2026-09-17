import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminDashboard from '@/views/admin/AdminDashboard';

export default function Page() {
  return (
    <ProtectedRoute roleRequired="ADMIN">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
