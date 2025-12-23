"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse bg-muted rounded ${className}`} />;
}

export function GraphSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Simulated nodes */}
        <div className="flex justify-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <div className="flex justify-center gap-6">
          <Skeleton className="w-14 h-14 rounded-full" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading your knowledge graph...
        </p>
      </div>
    </div>
  );
}

export function NoteDetailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
      <div className="pt-4">
        <Skeleton className="h-20 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function SearchResultSkeleton() {
  return (
    <div className="p-4 space-y-2 animate-pulse">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
    </div>
  );
}
