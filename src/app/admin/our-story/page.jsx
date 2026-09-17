import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OurStoryPage from '@/views/admin/OurStoryPage';

export default function Page() {
  return (
    <ProtectedRoute roleRequired="ADMIN">
      <OurStoryPage />
    </ProtectedRoute>
  );
}
