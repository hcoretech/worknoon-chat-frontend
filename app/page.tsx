'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';
import Cookies from 'js-cookie';

export default function RootIndexPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for the global hydration wrapper to complete session checks
    if (isLoading) return;

    // Direct lookups matching token validations across your cookies ledger
    const token = user?.token || Cookies.get('token') || null;
    const activeRole = user?.role || null;

    if (!token) {
      router.replace('/auth');
    } else if (activeRole === 'agent') {
      router.replace('/dashboard');
    } else {
      router.replace('/dashboard');
    }
  }, [user, isAuthenticated, isLoading, router]);


  return (
    <div className="h-screen w-screen bg-gray-50 dark:bg-zinc-950 flex flex-col items-center justify-center">
      <div className="h-6 w-6 border-2 border-neutral-950 dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
