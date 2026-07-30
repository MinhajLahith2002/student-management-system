"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiGrid, FiUsers, FiLogOut } from 'react-icons/fi';
import { APP_NAME, JWT_STORAGE_KEY } from '@/lib/constants';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: <FiGrid size={20} /> },
    { name: 'Students', href: '/students', icon: <FiUsers size={20} /> },
  ];

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-border/50 transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-16 items-center justify-center border-b border-border/50 md:hidden">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          {APP_NAME}
        </h1>
      </div>
      
      <div className="flex flex-col gap-2 p-4 pt-8">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && item.href !== '#';
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className={`${isActive ? 'text-primary' : 'text-slate-400'}`}>
                {item.icon}
              </div>
              {item.name}
              
              {isActive && (
                <div className="ml-auto w-1.5 h-6 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="absolute bottom-8 left-4 right-4">
        <button 
          onClick={() => {
            localStorage.removeItem(JWT_STORAGE_KEY);
            router.push('/login');
          }}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition-colors"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};
