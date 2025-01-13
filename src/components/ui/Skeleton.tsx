import React from 'react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`
        animate-pulse
        bg-gray-200 dark:bg-gray-700
        rounded
        ${className}
      `}
    />
  );
}

export function SkeletonText() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  );
}