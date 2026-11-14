import React from 'react';

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[#8BC34A] hover:bg-[#7CB342] text-white shadow-sm',
    secondary: 'bg-[#F4F9EE] text-[#558B2F] hover:bg-[#E8F3DC]',
    outline: 'border border-gray-300 text-[#1A1A1A] hover:bg-gray-50',
    dark: 'bg-[#1A1A1A] hover:bg-black text-white'
  }[variant];

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2 text-xs sm:text-sm',
    lg: 'px-7 py-3.5 text-sm'
  }[size];

  return (
    <button
      className={`rounded-full font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${variantStyles} ${sizeStyles} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

