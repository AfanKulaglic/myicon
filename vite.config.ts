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
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy admin image uploads to catbox.moe to bypass the browser's
      // same-origin policy. catbox doesn't send CORS headers, so a direct
      // browser fetch is blocked. Vite forwards POST /api/catbox-upload to
      // https://catbox.moe/user/api.php server-side, then returns the
      // plain-text URL back to the browser.
      "/api/catbox-upload": {
        target: "https://catbox.moe",
        changeOrigin: true,
        secure: true,
        rewrite: () => "/user/api.php",
      },
    },
  },
});
