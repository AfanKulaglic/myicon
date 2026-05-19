export function ProductDetailSkeleton() {
  return (
    <div className="container py-8 lg:py-12 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-square rounded-xl bg-surface-alt" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="size-16 rounded-lg bg-surface-alt" />
            ))}
          </div>
        </div>
        {/* Info panel */}
        <div className="space-y-4">
          <div className="h-4 w-1/3 rounded bg-surface-alt" />
          <div className="h-7 w-2/3 rounded bg-surface-alt" />
          <div className="h-5 w-1/4 rounded bg-surface-alt" />
          <div className="space-y-2 mt-4">
            <div className="h-3.5 w-full rounded bg-surface-alt" />
            <div className="h-3.5 w-5/6 rounded bg-surface-alt" />
            <div className="h-3.5 w-4/6 rounded bg-surface-alt" />
          </div>
          <div className="h-10 w-full rounded-lg bg-surface-alt mt-6" />
          <div className="h-10 w-full rounded-lg bg-surface-alt" />
        </div>
      </div>
    </div>
  );
}
