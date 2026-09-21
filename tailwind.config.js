/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#04040f",
          900: "#070712",
          800: "#0a0a1e",
          700: "#0f0f2a",
          600: "#141438",
          500: "#1a1a4a",
        },
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
        },
        mint: {
          DEFAULT: "#00d4aa",
          dim: "#00d4aa22",
          glow: "#00d4aa44",
        },
        indigo: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
        },
        data: "#c8d6ef",
        muted: "#4a5568",
        border: "#16163a",
        surface: "#0a0a1f",
      },
      fontFamily: {
        mono: ["Space Mono", "monospace"],
        sans: ["DM Sans", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in": "fadeIn 0.3s ease-out",
        scan: "scan 8s linear infinite",
      },
      keyframes: {
        glow: {
          from: { boxShadow: "0 0 10px #00d4aa33" },
          to: { boxShadow: "0 0 25px #00d4aa66, 0 0 50px #00d4aa22" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        scan: {
          from: { backgroundPosition: "0 -100vh" },
          to: { backgroundPosition: "0 100vh" },
        },
      },
      boxShadow: {
        mint: "0 0 20px #00d4aa33",
        "mint-lg": "0 0 40px #00d4aa44",
        glow: "0 0 30px #6366f133",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(22,22,58,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(22,22,58,0.5) 1px, transparent 1px)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
