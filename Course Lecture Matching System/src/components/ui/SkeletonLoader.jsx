import React from 'react';

// Skeleton for cards
export function CardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="h-10 w-10 bg-neutral-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-neutral-200 rounded w-full"></div>
        <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
        <div className="h-3 bg-neutral-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}

// Skeleton for table rows
export function TableRowSkeleton() {
  return (
    <tr className="border-b border-neutral-100 animate-pulse">
      <td className="py-3 px-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-neutral-200 rounded-full"></div>
          <div>
            <div className="h-4 bg-neutral-200 rounded w-24 mb-1"></div>
            <div className="h-3 bg-neutral-200 rounded w-16"></div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-neutral-200 rounded-full"></div>
          <div>
            <div className="h-4 bg-neutral-200 rounded w-20 mb-1"></div>
            <div className="h-3 bg-neutral-200 rounded w-14"></div>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="h-6 bg-neutral-200 rounded-full w-20"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-6 bg-neutral-200 rounded-full w-16"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-6 bg-neutral-200 rounded-full w-12"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-6 bg-neutral-200 rounded-full w-14"></div>
      </td>
      <td className="py-3 px-4">
        <div className="h-4 bg-neutral-200 rounded w-20"></div>
      </td>
      <td className="py-3 px-4">
        <div className="flex space-x-2">
          <div className="h-8 w-8 bg-neutral-200 rounded"></div>
          <div className="h-8 w-8 bg-neutral-200 rounded"></div>
        </div>
      </td>
    </tr>
  );
}

// Skeleton for stats cards
export function StatsCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-neutral-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-3 bg-neutral-200 rounded w-20 mb-2"></div>
          <div className="h-6 bg-neutral-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for course cards
export function CourseCardSkeleton() {
  return (
    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-neutral-200 rounded-full"></div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-4 bg-neutral-200 rounded w-32"></div>
              <div className="h-5 bg-neutral-200 rounded-full w-16"></div>
              <div className="h-5 bg-neutral-200 rounded-full w-20"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-neutral-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-neutral-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-neutral-200 rounded w-16"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-5 bg-neutral-200 rounded-full w-16"></div>
                <div className="h-5 bg-neutral-200 rounded-full w-20"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-neutral-200 rounded"></div>
          <div className="h-8 w-8 bg-neutral-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for dashboard tabs
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 bg-neutral-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-neutral-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-10 bg-neutral-200 rounded w-24 animate-pulse"></div>
          <div className="h-10 bg-neutral-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-neutral-200 rounded w-28 animate-pulse"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="card animate-pulse">
        <div className="p-6">
          <div className="h-6 bg-neutral-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton for empty state
export function EmptyStateSkeleton() {
  return (
    <div className="text-center py-8 animate-pulse">
      <div className="h-16 w-16 bg-neutral-200 rounded-full mx-auto mb-4"></div>
      <div className="h-4 bg-neutral-200 rounded w-48 mx-auto mb-2"></div>
      <div className="h-3 bg-neutral-200 rounded w-64 mx-auto"></div>
    </div>
  );
}

// Skeleton for navigation tabs
export function TabSkeleton() {
  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="px-4 sm:px-6">
        <nav className="flex space-x-2 sm:space-x-8 overflow-x-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-2 py-4 px-2 animate-pulse">
              <div className="h-4 w-4 bg-neutral-200 rounded"></div>
              <div className="h-4 bg-neutral-200 rounded w-16"></div>
              <div className="h-5 bg-neutral-200 rounded-full w-6"></div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default {
  CardSkeleton,
  TableRowSkeleton,
  StatsCardSkeleton,
  CourseCardSkeleton,
  DashboardSkeleton,
  EmptyStateSkeleton,
  TabSkeleton
};

