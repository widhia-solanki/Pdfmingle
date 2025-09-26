// src/components/NewMobileMenu.tsx

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Menu, X, FileQuestion, Info, LogIn, LogOut, Mail } from "lucide-react";
import { toolArray, iconMap } from "@/constants/tools";
import Link from "next/link";
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

// ... (PDFMingleLogo component remains the same)

export const NewMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth(); // Get user and logout function from context

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground" aria-label="Open Menu"><Menu className="h-6 w-6" /></Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-background/80 backdrop-blur-lg border-r border-border flex flex-col">
        {/* ... (Header with Logo remains the same) */}

        <nav className="flex-grow overflow-y-auto p-4 space-y-2">
          <Accordion type="single" collapsible className="w-full">
            {/* ... (Accordion with tool list remains the same) */}
          </Accordion>

          <Separator />
          
          {/* --- DYNAMIC AUTH LINKS --- */}
          <div className="flex flex-col gap-1 px-3 pt-2">
             {user ? (
                <Button variant="outline" className="justify-start gap-3 p-3 h-auto text-muted-foreground" onClick={logout}>
                  <LogOut className="h-6 w-6" />
                  <span className="font-medium">Logout</span>
                </Button>
             ) : (
                <Link href="/login" passHref>
                  <Button variant="outline" className="w-full justify-start gap-3 p-3 h-auto text-muted-foreground">
                    <LogIn className="h-6 w-6" />
                    <span className="font-medium">Login</span>
                  </Button>
                </Link>
             )}
             <Link href="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-md text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">
                <Mail className="h-6 w-6 text-muted-foreground" />
                <span className="font-medium">Contact Us</span>
             </Link>
             <Link href="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-md text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors">
                <Info className="h-6 w-6 text-muted-foreground" />
                <span className="font-medium">About Us</span>
             </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};```

### Final Step: Protect a Page (Example)

Now, using your new `AuthGuard` is incredibly simple. Let's say you want to create a new, protected `/dashboard` page.

1.  **Create the page:** `src/pages/dashboard.tsx`
2.  **Wrap it with the `AuthGuard`:**

```tsx
// Example: src/pages/dashboard.tsx

import { NextPage } from 'next';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';

const DashboardPage: NextPage = () => {
  const { user } = useAuth();

  return (
    // Wrap the entire page content with AuthGuard
    <AuthGuard>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-4 text-lg">
          Welcome, {user?.email}! This is a protected page.
        </p>
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;
