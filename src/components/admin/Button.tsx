import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gradient' | 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'gradient',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2 font-semibold',
    lg: 'text-base px-5 py-3 rounded-2xl gap-2.5 font-semibold',
  };

  const variantStyles = {
    gradient: 'bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-soft hover:shadow-glow-primary hover:brightness-105 active:brightness-95 border-none',
    primary: 'bg-[#FF6B35] text-white hover:bg-[#E85924] shadow-soft hover:shadow-glow-primary',
    secondary: 'bg-[#F7931E] text-white hover:bg-[#E08011]',
    accent: 'bg-[#2EC4B6] text-white hover:bg-[#25A99D] shadow-soft hover:shadow-glow-teal',
    outline: 'border border-gray-200 bg-white text-gray-700 hover:bg-orange-50/50 hover:border-primary/50 hover:text-primary shadow-xs',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    danger: 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 hover:text-rose-700',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};

