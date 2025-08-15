import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { MainLayout } from '@/layouts/MainLayout';
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
      <SpeedInsights /> 
      {/* 
        THE FIX:
        The <SpeedInsights /> component should be placed here,
        outside of your main layout but still inside the main App return.
      */}
    </>
  );
}
