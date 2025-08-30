import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/constants/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'panel-bg': "url('/panel-bg.png')",
      },
      colors: {
        // --- NEW COLOR FOR THE HERO ---
        'hero-bg': '#2d3748', // Dark Slate
        'filter-inactive-bg': 'rgba(255, 255, 255, 0.1)',
        'brand-blue': '#3B82F6',
        'brand-blue-dark': '#2563EB',
        'ilovepdf-text': '#333333',
        // --- END OF NEW COLORS ---
        
        'ilovepdf-red': '#3B82F6', 
        'ilovepdf-red-dark': '#2563EB',
        
        border: "hsl(var(--border))",
        // ... rest of your shadcn colors
      },
      // ... rest of your theme
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
