// src/pages/_app.tsx

import '@/index.css'; // Corrected path to your global CSS
import type { AppProps } from 'next/app';
import { MainLayout } from '@/layouts/MainLayout';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"; // 1. Import Analytics

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <SpeedInsights /> 
      <Analytics /> {/* 2. Add the Analytics component */}
    </>
  );
}
