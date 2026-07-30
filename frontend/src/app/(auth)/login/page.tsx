import React from 'react';
import { LoginForm } from '@/components/forms/LoginForm';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 p-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="glass-panel p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Top highlight line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary inline-block mb-2">
              {APP_NAME}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Sign in to manage student records
            </p>
          </div>
          
          <LoginForm />
        </div>
        
        <p className="text-center text-slate-500 mt-8 text-sm">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
