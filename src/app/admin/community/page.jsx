import ProtectedRoute from '@/components/auth/ProtectedRoute';
import CommunityPage from '@/views/admin/CommunityPage';

export default function Page() {
  return (
    <ProtectedRoute roleRequired="ADMIN">
      <CommunityPage />
    </ProtectedRoute>
  );
}
