import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProductsPage from '@/views/admin/ProductsPage';

export default function Page() {
  return (
    <ProtectedRoute roleRequired="ADMIN">
      <ProductsPage />
    </ProtectedRoute>
  );
}
