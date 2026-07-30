"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { JWT_STORAGE_KEY } from '@/lib/constants';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, rememberMe?: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists on load
    const token = localStorage.getItem(JWT_STORAGE_KEY) || sessionStorage.getItem(JWT_STORAGE_KEY);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token: string, rememberMe = false) => {
    if (rememberMe) {
      localStorage.setItem(JWT_STORAGE_KEY, token);
    } else {
      sessionStorage.setItem(JWT_STORAGE_KEY, token);
    }
    setIsAuthenticated(true);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem(JWT_STORAGE_KEY);
    sessionStorage.removeItem(JWT_STORAGE_KEY);
    setIsAuthenticated(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
