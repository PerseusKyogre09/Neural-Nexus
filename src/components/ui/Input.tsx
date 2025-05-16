import React, { useState } from 'react';
import { Search, Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Determine the actual input type based on showPassword state
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Handle toggling password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Create password visibility toggle icon
  const passwordToggleIcon = type === 'password' && (
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="focus:outline-none text-gray-400 hover:text-gray-500"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" />
      ) : (
        <Eye className="h-5 w-5" />
      )}
    </button>
  );

  // Use password toggle icon or provided rightIcon
  const actualRightIcon = type === 'password' ? passwordToggleIcon : rightIcon;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          className={`
            block w-full rounded-lg
            border border-gray-300 dark:border-gray-700
            bg-white dark:bg-gray-800
            px-4 py-2
            text-gray-900 dark:text-white
            placeholder:text-gray-500
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50
            ${leftIcon ? 'pl-10' : ''}
            ${actualRightIcon ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          type={inputType}
          {...props}
        />
        {actualRightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {actualRightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

export function SearchInput(props: Omit<InputProps, 'leftIcon'>) {
  return (
    <Input
      leftIcon={<Search className="h-5 w-5" />}
      placeholder="Search..."
      {...props}
    />
  );
}