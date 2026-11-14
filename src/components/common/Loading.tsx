import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  className = 'py-12 flex flex-col items-center justify-center gap-3 text-gray-500'
}) => (
  <div className={className}>
    <Loader2 className="w-8 h-8 animate-spin text-[#8BC34A]" />
    <span className="text-xs font-semibold">{message}</span>
  </div>
);

