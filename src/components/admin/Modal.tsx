import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-white rounded-2xl shadow-soft-lg border border-gray-100 overflow-hidden transform transition-all duration-300 z-10 my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with subtle gradient/glassmorphism */}
        {(title || subtitle) && (
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50/40 via-white to-amber-50/30 flex items-center justify-between">
            <div>
              {typeof title === 'string' ? (
                <h3 className="text-lg font-bold text-gray-900 font-display">
                  {title}
                </h3>
              ) : (
                title
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100/80 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content body */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

