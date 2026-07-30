"use client";

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { JWT_STORAGE_KEY } from '@/lib/constants';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Since isAuthenticated is initially false, we might want to check localStorage directly 
    // or wait for the AuthContext to initialize. The AuthContext runs a useEffect on mount.
    // If after mount we are not authenticated, redirect.
    const token = localStorage.getItem(JWT_STORAGE_KEY) || sessionStorage.getItem(JWT_STORAGE_KEY);
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  if (!mounted) return null; // Prevent hydration mismatch

  return (
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
  );
}
