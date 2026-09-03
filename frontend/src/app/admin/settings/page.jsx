import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SettingsPage from '@/views/admin/SettingsPage';

export default function Page() {
  return (
    <ProtectedRoute roleRequired="ADMIN">
      <SettingsPage />
    </ProtectedRoute>
  );
}
