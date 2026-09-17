import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProductEditPage from '@/views/admin/ProductEditPage';

export default function Page() {
  return (
    <ProtectedRoute roleRequired="ADMIN">
      <ProductEditPage />
    </ProtectedRoute>
  );
}
