"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { FiLogOut, FiUser, FiClock } from 'react-icons/fi';
import { APP_NAME } from '@/lib/constants';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on client side to avoid hydration mismatch
    setCurrentTime(new Date());
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border/50">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hover:opacity-80 transition-opacity cursor-pointer">
            {APP_NAME}
          </Link>
          
          {/* Real-time Clock */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 text-slate-500 dark:text-slate-400">
            <FiClock size={14} className="text-primary" />
            <span className="text-sm font-medium tabular-nums">
              {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Admin User</span>
              <span className="text-xs text-slate-500">Administrator</span>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
              <FiUser size={18} />
            </div>
            
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="p-2 ml-2 rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 text-slate-500 transition-colors"
              title="Logout"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      <Modal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        title="Confirm Logout"
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
              <FiLogOut className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div>
              <p className="text-slate-700 dark:text-slate-300 mt-1">
                Are you sure you want to log out of the dashboard?
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setShowLogoutModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => {
              setShowLogoutModal(false);
              logout();
            }}>Log Out</Button>
          </div>
        </div>
      </Modal>
    </header>
  );
};
