import React from 'react';

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  fullWidth = true,
  className = '',
  ...props
}) => (
  <div className={`${fullWidth ? 'w-full' : ''}`}>
    {label && (
      <label className="block text-xs font-bold text-gray-700 mb-1">
        {label}
      </label>
    )}
    <input
      className={`w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#8BC34A] transition ${
        error ? 'border-red-400 focus:ring-red-200' : ''
      } ${className}`}
      {...props}
    />
    {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
  </div>
);

