import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { MainLayout } from '@/layouts/MainLayout';
import { SpeedInsights } from "@vercel/speed-insights/next"; // 1. IMPORT SpeedInsights

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
      <SpeedInsights /> 
      {/* 2. ADD the component here */}
    </MainLayout>
  );
}
