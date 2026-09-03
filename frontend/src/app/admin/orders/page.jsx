import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OrdersPage from '@/views/admin/OrdersPage';

export default function Page() {
  return (
    <ProtectedRoute roleRequired="ADMIN">
      <OrdersPage />
    </ProtectedRoute>
  );
}
