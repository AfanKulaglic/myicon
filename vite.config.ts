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
    target: "esnext",
    cssCodeSplit: true,
    minify: "terser", // Better compression than esbuild
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"], // Remove specific console calls
      },
    },
    rollupOptions: {
      output: {
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
          // Firebase SDK — only needed when Firestore hooks fire
          if (id.includes("firebase") || id.includes("@firebase")) {
            return "vendor-firebase";
          }
          // Form validation stack
          if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) {
            return "vendor-forms";
          }
          // Core React runtime — very small, cacheable forever
          if (id.includes("react-dom") || id.includes("react/") || id.includes("scheduler")) {
            return "vendor-react";
          }
          // React Router
          if (id.includes("react-router")) {
            return "vendor-router";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
