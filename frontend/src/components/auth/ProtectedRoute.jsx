'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, roleRequired }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (roleRequired && user.role !== roleRequired) {
      router.replace('/account');
    }
  }, [user, loading, roleRequired, router]);

  if (loading) return <div className="p-10 text-center">Loading Access...</div>;
  if (!user) return null;
  if (roleRequired && user.role !== roleRequired) return null;

  return children;
}
