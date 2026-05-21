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

  return (
    <div className={cn("relative overflow-hidden bg-surface-alt", aspectClasses[aspectRatio], className)}>
      {/* Simple skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-surface-alt" />
      )}

      {/* Actual image */}
      <img
        src={src}
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
