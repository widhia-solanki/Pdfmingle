// src/pages/_app.tsx

import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MainLayout } from '@/layouts/MainLayout';
// ... other imports
import { AuthProvider } from '@/contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Re-add this
import { useRouter } from 'next/router';

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const flushLayoutRoutes = new Set(['/add-watermark', '/edit-pdf']);
  const isHomePage = router.pathname === '/';
  const shouldUseFlushLayout = isHomePage || flushLayoutRoutes.has(router.pathname);
  
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    return <div>Error: Google Client ID is not configured.</div>;
  }

  return (
    // Re-wrap the app with the correct Google provider
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Head>
            {/* ... */}
          </Head>
          <DefaultSeo {...SEO} />
          <MainLayout flush={shouldUseFlushLayout}>
            <Component {...pageProps} />
          </MainLayout>
          {/* ... */}
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
