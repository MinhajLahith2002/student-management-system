import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`premium-input ${icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <span className="text-sm text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
