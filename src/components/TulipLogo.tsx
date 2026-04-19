import React from 'react';

export const TulipLogo = ({ className = "w-6 h-6", size, style, ...props }: React.SVGProps<SVGSVGElement> & { size?: number | string }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="currentColor" 
    className={className} 
    style={{ ...(size ? { width: size, height: size } : {}), ...style }}
    {...props}
  >
    <path d="M 35 20 C 10 40 15 75 42 85 C 54 65 52 40 35 20 Z" />
    <path d="M 50 10 C 60 40 62 70 48 90 C 72 80 70 35 50 10 Z" />
    <path d="M 65 20 C 90 35 95 75 58 85 C 80 75 78 40 65 20 Z" />
  </svg>
);
