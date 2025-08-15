
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
        // --- THIS IS THE NEW SECTION ---
        'filter-bg': "url('/filter-bg.jpeg')",
        'tools-bg': "url('/tools-bg.jpeg')",
        'panel-bg': "url('/panel-bg.png')",
      },
      colors: {
        'ilovepdf-red': '#3B82F6',
        'ilovepdf-red-dark': '#2563EB',
        'ilovepdf-text': '#333333',
        // ... rest of your colors
      },
      // ... rest of your theme
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
