import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2015", // Better mobile browser support
    cssCodeSplit: true,
    minify: "terser", // Better compression than esbuild
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"], // Remove specific console calls
        passes: 3, // More passes for better compression (was 2)
        unsafe_arrows: true, // Convert functions to arrows when safe
        unsafe_methods: true, // Optimize method calls
        unsafe_proto: true, // Optimize prototype access
      },
      mangle: {
        safari10: true, // Fix Safari 10 bugs
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    // Optimize chunk sizes for mobile
    chunkSizeWarningLimit: 400, // Stricter limit (was 500)
    rollupOptions: {
      output: {
        // Optimize chunk naming for better caching
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
        // More aggressive code splitting for better mobile performance
        manualChunks(id) {
          // Konva / canvas designer — largest chunk, only needed on /customize
          if (id.includes("konva") || id.includes("react-konva") || id.includes("use-image")) {
            return "vendor-konva";
          }
          // Swiper — only needed on home / product pages
          if (id.includes("swiper")) {
            return "vendor-swiper";
          }
          // Framer Motion
          if (id.includes("framer-motion")) {
            return "vendor-framer";
          }
          // Firebase SDK — keep together to avoid circular dependencies
          if (id.includes("firebase") || id.includes("@firebase")) {
            return "vendor-firebase";
          }
          // Form validation stack
          if (id.includes("react-hook-form") || id.includes("@hookform")) {
            return "vendor-forms";
          }
          if (id.includes("zod")) {
            return "vendor-validation";
          }
          // Lucide icons - separate chunk
          if (id.includes("lucide-react")) {
            return "vendor-icons";
          }
          // Core React runtime — very small, cacheable forever
          if (id.includes("react-dom") || id.includes("react/") || id.includes("scheduler")) {
            return "vendor-react";
          }
          // React Router
          if (id.includes("react-router")) {
            return "vendor-router";
          }
          // Zustand state management
          if (id.includes("zustand")) {
            return "vendor-state";
          }
          // Split node_modules into smaller chunks for better caching
          if (id.includes("node_modules")) {
            return "vendor-misc";
          }
        },
      },
    },
    // Enable source maps for debugging but keep them external
    sourcemap: false, // Disable for production to reduce size
    // Optimize CSS
    cssMinify: true,
  },
  server: {
    port: 5173,
    open: true,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "zustand",
      "lucide-react",
    ],
    exclude: [
      "konva",
      "react-konva",
      "firebase",
    ],
  },
});
