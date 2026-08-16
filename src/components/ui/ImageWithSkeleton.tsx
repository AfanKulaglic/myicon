import { useState } from "react";
import { cn, optimizeImage } from "@/lib/utils";

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
  const [loaded, setLoaded] = useState(false);
  // Remote images are optimized on the fly (resized + WebP) via wsrv.nl,
  // so e.g. a 2.7 MB ImgBB PNG becomes ~20 KB at card size.
  const optimizedSrc = optimizeImage(src, width ?? 800);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    auto: "",
  };

  return (
    <div className={cn("relative overflow-hidden bg-surface-alt", aspectClasses[aspectRatio], className)}>
      {/* Simple skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-surface-alt" />
      )}

      {/* Actual image */}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={cn(
          "size-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
