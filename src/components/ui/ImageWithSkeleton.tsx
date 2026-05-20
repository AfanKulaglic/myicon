import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
  priority?: boolean;
}

export function ImageWithSkeleton({
  src,
  alt,
  className,
  aspectRatio = "auto",
  priority = false,
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
      {/* Skeleton loader */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface-alt via-white to-surface-alt">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-brand/10 rounded-xl animate-pulse" />
          </div>
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)} // Hide skeleton even on error
        className={cn(
          "size-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
