import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { MainLayout } from '@/layouts/MainLayout'; // CORRECT IMPORT: With curly braces

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}
