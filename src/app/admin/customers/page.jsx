import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CustomersPage from '@/views/admin/CustomersPage';

export default function Page() {
  return (
    <ProtectedRoute roleRequired="ADMIN">
      <CustomersPage />
    </ProtectedRoute>
  );
}
