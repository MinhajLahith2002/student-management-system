"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { FiLogOut, FiMenu, FiBell, FiUser } from 'react-icons/fi';
import { APP_NAME } from '@/lib/constants';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-border/50">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 md:hidden"
          >
            <FiMenu size={24} />
          </button>
          
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hidden sm:block">
            {APP_NAME}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 relative">
            <FiBell size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Admin User</span>
              <span className="text-xs text-slate-500">Administrator</span>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white shadow-md">
              <FiUser size={18} />
            </div>
            
            <button 
              onClick={logout}
              className="p-2 ml-2 rounded-full hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 text-slate-500 transition-colors"
              title="Logout"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
