import ProtectedRoute from '@/components/auth/ProtectedRoute';
import MyOrders from '@/views/account/MyOrders';

export default function Page() {
  return (
    <ProtectedRoute>
      <MyOrders />
    </ProtectedRoute>
  );
}
