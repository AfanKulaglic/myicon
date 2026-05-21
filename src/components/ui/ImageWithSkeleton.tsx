import { cn } from "@/lib/utils";
import { useImageCache } from "@/hooks/useImageCache";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  priority?: boolean;
  width?: number;
  height?: number;
}

export function ImageWithSkeleton({
  src,
  alt,
  className,
  aspectRatio = "auto",
  priority = false,
  width,
  height,
}: ImageWithSkeletonProps) {
  // Use image cache hook for persistent caching across navigations
  const { loaded, isInCache } = useImageCache(src, priority);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  return (
    <div className={cn("relative overflow-hidden bg-surface-alt", aspectClasses[aspectRatio], className)}>
      {/* Animated skeleton - only show if not in cache */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-surface-alt via-surface to-surface-alt animate-pulse" />
      )}

      {/* Actual image with crossOrigin for better caching */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        crossOrigin="anonymous"
        className={cn(
          "size-full object-cover transition-opacity",
          // Instant display if cached, smooth transition if loading
          isInCache ? "duration-0" : "duration-500",
          loaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          contentVisibility: priority ? 'auto' : 'auto',
        }}
      />
    </div>
  );
}
