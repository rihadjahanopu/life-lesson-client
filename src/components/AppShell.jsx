'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/app/loading';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? '' : 'flex-1'}>{children}</main>
      {!isAdmin && <Footer />}
    </>
  );
}
