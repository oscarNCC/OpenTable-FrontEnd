import type { ReactNode } from 'react';

export interface ChartWrapperProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ChartWrapper({ title, children, className = '' }: ChartWrapperProps) {
  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="px-4 py-2 border-b border-gray-200 font-medium bg-gray-50">
        {title}
      </div>
      <div className="p-4 min-h-[200px] flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
