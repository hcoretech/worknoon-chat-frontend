// 📁 File: src/app/dashboard/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/authContext';
import { useSocket } from '../../hooks/useSocket';
import Cookies from 'js-cookie';

export default function DashboardProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  // Safely extract token out of nested object fallback layer
  let authTokenString: string | null = null;
  if (user?.token) {
    authTokenString = user.token;
  } else {
    const savedCookie = Cookies.get('token');
    if (savedCookie) {
      try {
        authTokenString = JSON.parse(savedCookie)?.token || null;
      } catch (e) {
        authTokenString = null;
      }
    }
  }

  const { isSocketConnected } = useSocket(authTokenString);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center">
        <div className="h-8 w-8 border-4 border-neutral-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black text-gray-400 mt-4 tracking-wide uppercase">Initializing Workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA] dark:bg-zinc-950">
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
