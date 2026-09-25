'use client';

import { ReactNode } from 'react';
import { AdminLayout } from '@/components/admin/admin-layout';
import { AuthProvider } from '@/lib/auth-context';

export default function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayout>{children}</AdminLayout>
    </AuthProvider>
  );
}
