export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col card overflow-hidden animate-pulse">
      {/* image area */}
      <div className="aspect-square bg-surface-alt" />
      {/* text area */}
      <div className="flex flex-col gap-2.5 p-3">
        <div className="h-3.5 w-3/4 rounded bg-surface-alt" />
        <div className="h-3 w-1/2 rounded bg-surface-alt" />
        <div className="mt-1 h-4 w-1/3 rounded bg-surface-alt self-end" />
      </div>
    </div>
  );
}
