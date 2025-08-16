import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'filter-bg': "url('/filter-bg.jpeg')",
        'tools-bg': "url('/tools-bg.jpeg')",
        'panel-bg': "url('/panel-bg.png')",
      },
      colors: {
        'ilovepdf-red': '#3B82F6',
        'ilovepdf-red-dark': '#2563EB',
        'ilovepdf-text': '#333333',
        // --- NEW COLORS FOR BUTTONS ---
        'ilovepdf-button-bg': '#333333', // Dark gray/black for active button
        'ilovepdf-button-text': '#ffffff', // White text for active button
        // --- END OF NEW COLORS ---
        
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... rest of your colors
      },
      // ... rest of your theme
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
