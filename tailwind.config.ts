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
        // We no longer need the image backgrounds, but keep panel-bg for the footer
        'panel-bg': "url('/panel-bg.png')",
      },
      colors: {
        // --- NEW COLORS FOR THE HERO AND BUTTONS ---
        'hero-bg': '#2d3748', // Dark Slate
        'filter-inactive-bg': 'rgba(255, 255, 255, 0.1)',
        'brand-blue': '#3B82F6', // The blue for the active button
        'brand-blue-dark': '#2563EB',
        'ilovepdf-text': '#333333',
        // --- END OF NEW COLORS ---
        
        // This is now redundant, but we'll keep it for other components
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
