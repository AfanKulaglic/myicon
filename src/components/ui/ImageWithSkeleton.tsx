import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  priority?: boolean;
  width?: number;
  height?: number;
}

// Helper to convert ImgBB URL to smaller size for mobile
function getResponsiveImageUrl(url: string, isMobile: boolean): string {
  if (!url.includes('i.ibb.co')) return url;
  
  // ImgBB doesn't support URL-based resizing, but we can add loading="lazy"
  // and let the browser handle it. For future: consider using imgproxy or similar.
  return url;
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
  const [loaded, setLoaded] = useState(false);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  // Detect mobile for potential optimizations
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const imageSrc = getResponsiveImageUrl(src, isMobile);

  return (
    <div className={cn("relative overflow-hidden bg-surface-alt", aspectClasses[aspectRatio], className)}>
      {/* Animated skeleton - restored for better UX */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-surface-alt via-surface to-surface-alt animate-pulse" />
      )}

      {/* Actual image */}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)} // Hide skeleton even on error
        className={cn(
          "size-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0"
        )}
        style={{
          contentVisibility: priority ? 'auto' : 'auto',
        }}
      />
    </div>
  );
}
