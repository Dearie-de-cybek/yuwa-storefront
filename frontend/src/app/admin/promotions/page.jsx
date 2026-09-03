import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PromotionsPage from '@/views/admin/PromotionsPage';

export default function Page() {
  return (
    <ProtectedRoute roleRequired="ADMIN">
      <PromotionsPage />
    </ProtectedRoute>
  );
}
