import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full border-collapse text-left ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-gray-200 dark:border-gray-700">
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TableRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={`
      border-b border-gray-200 dark:border-gray-700
      hover:bg-gray-50 dark:hover:bg-gray-800
      transition-colors
      ${className}
    `}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`
      px-6 py-3
      text-sm font-semibold
      text-gray-900 dark:text-white
      ${className}
    `}>
      {children}
    </th>
  );
}

export function TableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`
      px-6 py-4
      text-sm
      text-gray-700 dark:text-gray-300
      ${className}
    `}>
      {children}
    </td>
  );
}