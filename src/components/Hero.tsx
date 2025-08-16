export const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden hero-gradient-background">
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-[-5%] left-[5%] w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl opacity-50"
          style={{ animation: 'float1 15s infinite ease-in-out' }}
        ></div>
        <div 
          className="absolute bottom-[-5%] right-[10%] w-80 h-80 bg-red-500/20 rounded-full filter blur-3xl opacity-50"
          style={{ animation: 'float2 20s infinite ease-in-out' }}
        ></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 text-center py-20 md:py-28">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          Every tool you need to work with PDFs in one place
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-300">
          Enjoy all the tools you need to work efficiently with your digital documents while keeping your data safe and secure.
        </p>
      </div>
    </section>
  );
};```
4.  Commit the new file.

---

### Step 2: Simplify the Main Layout (`MainLayout.tsx`)

Now, we will remove the animated background from the main layout and give it a clean, light gray background that will flow seamlessly between the tools grid and the footer.

**Action:**
1.  Go to the file **`src/layouts/MainLayout.tsx`**.
2.  **Replace the entire content** of that file with this new, cleaner version:

```tsx
import React from "react";
import { Header } from "@/components/Header";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FeedbackButton } from "@/components/FeedbackButton";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    // The background is now a simple, clean light gray
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      {/* The main content area no longer needs its own background color */}
      <main className="flex-grow">
        {children}
      </main>
      <footer className="text-center py-6 text-sm text-gray-600 border-t bg-white">
        <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 mb-4 px-4">
          <Link href="/about" className="hover:underline text-gray-500">
            About Us
          </Link>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <Link href="/privacy" className="hover:underline text-gray-500">
            Privacy Policy
          </Link>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <Link href="/terms" className="hover:underline text-gray-500">
            Terms & Conditions
          </Link>
        </div>
        © PDFMingle 2025 - Your PDF Editor
      </footer>
      <FeedbackButton />
    </div>
  );
};
