import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline';
  disabled?: boolean;
};

export function Button({ children, onClick, className = '', variant = 'default', disabled = false }: ButtonProps) {
  const baseStyle = 'px-4 py-2 rounded-md font-medium transition-colors';
  const variantStyle = variant === 'default' ? 'bg-pink-500 hover:bg-pink-600 text-white' : 'border border-gray-300 bg-transparent hover:bg-gray-100 text-white';
  const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${disabledStyle} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
} 