import React from 'react';

interface FloatingLeafProps {
  className?: string;
  flip?: boolean;
}

export const FloatingLeaf: React.FC<FloatingLeafProps> = ({ className = '', flip = false }) => (
  <svg
    viewBox="0 0 120 120"
    className={`pointer-events-none select-none ${className}`}
    style={{ transform: flip ? 'scaleX(-1)' : undefined }}
    fill="none"
  >
    <path
      d="M15 105C15 105 22 42 75 18C105 4 112 15 105 45C92 98 15 105 15 105Z"
      fill="url(#leafGrad)"
      stroke="#558B2F"
      strokeWidth="2"
    />
    <path
      d="M15 105C42 78 72 48 102 20"
      stroke="#DCEDC8"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path d="M45 76L35 55" stroke="#DCEDC8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M65 56L52 36" stroke="#DCEDC8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M55 66L78 62" stroke="#DCEDC8" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M75 46L95 43" stroke="#DCEDC8" strokeWidth="1.8" strokeLinecap="round" />
    <defs>
      <linearGradient id="leafGrad" x1="15" y1="18" x2="105" y2="105" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8BC34A" />
        <stop offset="1" stopColor="#558B2F" />
      </linearGradient>
    </defs>
  </svg>
);

