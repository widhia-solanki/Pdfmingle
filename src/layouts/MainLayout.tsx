import React from "react";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { FeedbackButton } from "@/components/FeedbackButton";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    // The main layout is now much simpler
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      
      {/* The old <footer> element has been completely removed from this file. */}
      
      <FeedbackButton />
    </div>
  );
};```

---

### Step 2: Add the Copyright Notice to the `InformativePanel`

Now, we will add the copyright line to the bottom of your new, primary footer panel.

**Action:**
1.  Go to the file **`src/components/InformativePanel.tsx`**.
2.  **Replace the entire content** of that file with this new, updated version:

```tsx
import Link from 'next/link';

export const InformativePanel = () => {
    return (
        <section className="w-full bg-gray-800 text-white py-12 md:py-16">
            <div className="container mx-auto px-4 text-center">
                {/* Main grid for links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-3 text-left">
                        <h4 className="font-bold text-lg">PDFMingle</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:underline opacity-80 hover:opacity-100">Home</Link></li>
                            <li><Link href="/about" className="hover:underline opacity-80 hover:opacity-100">About Us</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3 text-left">
                        <h4 className="font-bold text-lg">LEGAL</h4>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="hover:underline opacity-80 hover:opacity-100">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:underline opacity-80 hover:opacity-100">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3 text-left">
                        <h4 className="font-bold text-lg">HELP</h4>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="hover:underline opacity-80 hover:opacity-100">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3 text-left">
                        <h4 className="font-bold text-lg">Follow Us</h4>
                        {/* Add social media links here later */}
                    </div>
                </div>

                {/* --- THIS IS THE FIX --- */}
                {/* Divider line and copyright notice added below the grid */}
                <div className="border-t border-gray-700 mt-12 pt-6">
                    <p className="text-sm text-gray-400">
                        © PDFMingle 2025 - Your PDF Editor
                    </p>
                </div>
                {/* --- END OF THE FIX --- */}
            </div>
        </section>
    );
};
