import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OrderDetail from '@/views/account/OrderDetail';

export default function Page() {
  return (
    <ProtectedRoute>
      <OrderDetail />
    </ProtectedRoute>
  );
}
