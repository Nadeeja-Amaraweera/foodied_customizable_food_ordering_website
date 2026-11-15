import React from 'react';
import { OrderStatus } from '../../data/adminMockData';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'new' | 'preparing' | 'confirmed' | 'delivered' | 'cancelled' | 'vip' | 'teal' | 'orange' | 'gray';
  status?: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  size = 'md',
  pulse = false,
  className = '',
}) => {
  // Determine variant from status if not provided directly
  const activeVariant = variant || (status as string) || 'gray';

  const variantStyles: Record<string, string> = {
    new: 'bg-rose-50 text-rose-600 border border-rose-200/70 font-semibold',
    preparing: 'bg-amber-50 text-amber-700 border border-amber-200/80 font-medium',
    confirmed: 'bg-sky-50 text-sky-700 border border-sky-200/80 font-medium',
    delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium',
    cancelled: 'bg-gray-100 text-gray-500 border border-gray-200/80 font-medium',
    vip: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-xs',
    teal: 'bg-teal-50 text-teal-700 border border-teal-200/80 font-medium',
    orange: 'bg-orange-50 text-orange-700 border border-orange-200/80 font-medium',
    gray: 'bg-slate-100 text-slate-700 border border-slate-200 font-medium',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md',
    md: 'text-xs px-2.5 py-1 rounded-lg',
    lg: 'text-sm px-3.5 py-1.5 rounded-xl',
  };

  const textLabel = children || (status ? status.toUpperCase() : '');

  return (
    <span
      className={`inline-flex items-center gap-1.5 transition-all duration-200 select-none ${
        variantStyles[activeVariant] || variantStyles.gray
      } ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
      )}
      {textLabel}
    </span>
  );
};

