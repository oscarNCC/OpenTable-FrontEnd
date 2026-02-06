import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

export function Card({ title, className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}
      {...props}
    >
      {title && (
        <div className="px-4 py-2 border-b border-gray-200 font-medium bg-gray-50">
          {title}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}
