import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { MainLayout } from '@/layouts/MainLayout';

// This is the main wrapper for all pages
export default function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}```

---

### Step 3: Add a Link in the Footer

Finally, let's add a link to the new page in your site's footer so users can easily find it.

**Action:**
1.  Go to the file **`src/layouts/MainLayout.tsx`**.
2.  **Replace the entire content** of the file with the code below, which includes the new "Terms & Conditions" link.

```tsx
import { Header } from "@/components/Header";
import Link from "next/link";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow container py-8 md:py-12">
        {children}
      </main>
      <footer className="text-center py-6 text-sm text-muted-foreground border-t">
        <div className="flex justify-center items-center gap-4 mb-4 flex-wrap">
          <Link href="/" className="hover:underline text-gray-600">
            Home
          </Link>
          <span className="text-gray-300">|</span>
          <Link href="/about" className="hover:underline text-gray-600">
            About Us
          </Link>
          <span className="text-gray-300">|</span>
          {/* --- THIS IS THE NEW LINK --- */}
          <Link href="/terms" className="hover:underline text-gray-600">
            Terms & Conditions
          </Link>
        </div>
        © PDFMingle 2025 - Your PDF Editor
      </footer>
    </div>
  );
};
