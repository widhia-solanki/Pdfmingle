// src/components/NewMobileMenu.tsx

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
// ... other ui imports
import { Button } from "@/components/ui/button";
import { Menu, X, FileQuestion, Info, LogIn, LogOut, Mail } from "lucide-react";
import { toolArray, iconMap } from "@/constants/tools";
import Link from "next/link";
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { UserNav } from './UserNav';

// ... PDFMingleLogo component is the same

export const NewMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession(); // Use the correct hook
  const loading = status === 'loading';

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-foreground" aria-label="Open Menu"><Menu className="h-6 w-6" /></Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-background/80 backdrop-blur-lg border-r border-border flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <PDFMingleLogo />
          {session?.user && <UserNav />}
          <SheetClose asChild><Button variant="ghost" size="icon" className="rounded-full text-foreground"><X className="h-6 w-6" /></Button></SheetClose>
        </div>
        <nav className="flex-grow overflow-y-auto p-4 space-y-2">
            {/* ... Accordion with tools list ... */}
            <Separator />
            <div className="flex flex-col gap-1 px-3 pt-2">
                {loading ? (<div className="h-12 w-full bg-muted animate-pulse rounded-md" />) : !session?.user && (<Button asChild variant="outline" className="justify-start gap-3 p-3 h-auto text-muted-foreground"><Link href="/api/auth/signin" onClick={(e) => { e.preventDefault(); signIn('google'); setIsOpen(false); }}><LogIn className="h-6 w-6" /><span className="font-medium">Login</span></Link></Button>)}
                <Link href="/contact" onClick={() => setIsOpen(false)} className="..."><Mail className="h-6 w-6" /> <span className="font-medium">Contact Us</span></Link>
                <Link href="/about" onClick={() => setIsOpen(false)} className="..."><Info className="h-6 w-6" /> <span className="font-medium">About Us</span></Link>
            </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
