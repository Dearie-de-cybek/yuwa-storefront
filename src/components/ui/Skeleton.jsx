// Simple shimmer block. Server component — safe to use in loading.js and views.
export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded bg-neutral-200/70 ${className}`} />;
}
