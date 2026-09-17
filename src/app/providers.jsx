'use client';

import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import CartDrawer from '@/components/checkout/CartDrawer';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <CartDrawer />
      {children}
    </AuthProvider>
  );
}
