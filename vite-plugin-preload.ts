import type { Plugin } from 'vite';

/**
 * Vite plugin to add modulepreload for critical chunks
 * This improves initial load time by preloading JavaScript modules
 */
export function preloadPlugin(): Plugin {
  return {
    name: 'vite-plugin-preload',
    transformIndexHtml(html) {
      // Add modulepreload hints for critical chunks
      const preloadLinks = `
    <!-- Preload critical JavaScript modules -->
    <link rel="modulepreload" href="/src/main.tsx" />
    <link rel="modulepreload" href="/src/App.tsx" />
      `.trim();
      
      return html.replace('</head>', `${preloadLinks}\n  </head>`);
    },
  };
}
