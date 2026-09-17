import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserAccount from '@/views/account/UserAccount';

export default function Page() {
  return (
    <ProtectedRoute>
      <UserAccount />
    </ProtectedRoute>
  );
}
