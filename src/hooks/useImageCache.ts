import { useState, useEffect, useRef } from "react";

// In-memory cache to track loaded images across component mounts
const imageCache = new Set<string>();

// Preload images in the background
const preloadedImages = new Map<string, HTMLImageElement>();

/**
 * Hook to manage image loading with persistent caching
 * Images are cached in memory and browser cache for instant display
 */
export function useImageCache(src: string, priority: boolean = false) {
  // Check if image is already cached
  const [loaded, setLoaded] = useState(() => imageCache.has(src));
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // If already in cache, mark as loaded immediately
    if (imageCache.has(src)) {
      setLoaded(true);
      return;
    }

    // Check if image is already preloaded
    if (preloadedImages.has(src)) {
      const img = preloadedImages.get(src)!;
      if (img.complete) {
        imageCache.add(src);
        setLoaded(true);
        return;
      }
    }

    // Create new image element for preloading
    const img = new Image();
    imgRef.current = img;

    // Set crossOrigin for CORS images (ImgBB)
    img.crossOrigin = "anonymous";

    const handleLoad = () => {
      imageCache.add(src);
      preloadedImages.set(src, img);
      setLoaded(true);
    };

    const handleError = () => {
      // Still mark as "loaded" to hide skeleton
      setLoaded(true);
    };

    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);

    // Start loading
    img.src = src;

    // If image is already complete (cached by browser)
    if (img.complete) {
      handleLoad();
    }

    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [src]);

  return { loaded, isInCache: imageCache.has(src) };
}

/**
 * Preload images in the background for faster subsequent loads
 */
export function preloadImages(urls: string[]) {
  urls.forEach((url) => {
    if (!imageCache.has(url) && !preloadedImages.has(url)) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      
      img.onload = () => {
        imageCache.add(url);
        preloadedImages.set(url, img);
      };
    }
  });
}

/**
 * Clear the image cache (useful for testing or memory management)
 */
export function clearImageCache() {
  imageCache.clear();
  preloadedImages.clear();
}
