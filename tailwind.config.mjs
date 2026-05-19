/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1E5AA8",
          50: "#EEF3FB",
          100: "#D6E2F3",
          200: "#AEC4E7",
          300: "#85A6DB",
          400: "#5C89CF",
          500: "#1E5AA8",
          600: "#194B8C",
          700: "#143C70",
          800: "#0F2D54",
          900: "#0A1E38",
        },
        ink: {
          DEFAULT: "#1E1E1E",
          muted: "#5A6675",
          subtle: "#8A95A4",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F5F6F8",
          soft: "#FAFBFC",
        },
        line: "#E5E7EB",
        accent: "#C5E337",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16,24,40,0.04), 0 1px 3px 0 rgba(16,24,40,0.06)",
        elevated: "0 4px 12px -2px rgba(16,24,40,0.08), 0 2px 4px -2px rgba(16,24,40,0.04)",
        pop: "0 12px 32px -8px rgba(16,24,40,0.12)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "slide-up": "slide-up 240ms cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
