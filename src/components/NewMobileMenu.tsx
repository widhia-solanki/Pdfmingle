// src/components/NewMobileMenu.tsx

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
// ... other ui imports
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import { Menu, X, FileQuestion, Info, LogIn, LogOut, Mail } from "lucide-react";
// ... other imports
import { useSession, signIn, signOut } from 'next-auth/react';

// ... (PDFMingleLogo component is the same)

export const NewMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = session?.user;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    signOut();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* ... SheetTrigger and SheetContent are the same ... */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <PDFMingleLogo />
          {/* ... SheetClose button is the same ... */}
        </div>

        <nav className="flex-grow overflow-y-auto p-4 space-y-4">
          {/* --- THIS IS THE NEW USER PROFILE SECTION --- */}
          {user && (
            <div className='flex items-center gap-3 px-3 pb-2'>
              <Avatar>
                {user.image && <AvatarImage src={user.image} alt={user.name || 'User Avatar'} />}
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground truncate">{user.name || 'User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* ... Accordion with tools list ... */}
          
          <Separator />
          
          <div className="flex flex-col gap-1 px-3 pt-2">
             {loading ? (
                <div className="h-12 w-full bg-muted animate-pulse rounded-md" />
             ) : user ? (
                <Button variant="outline" className="justify-start gap-3 p-3 h-auto text-muted-foreground" onClick={handleLogoutClick}>
                  <LogOut className="h-6 w-6" /><span className="font-medium">Logout</span>
                </Button>
             ) : (
                <Button asChild variant="outline" className="justify-start gap-3 p-3 h-auto text-muted-foreground">
                    <Link href="/login" onClick={(e) => { e.preventDefault(); signIn('google'); setIsOpen(false); }}>
                        <LogIn className="h-6 w-6" /><span className="font-medium">Login</span>
                    </Link>
                </Button>
             )}
             {/* ... (Contact and About links remain the same) ... */}
          </div>
        </nav>
      {/* ... */}
    </Sheet>
  );
};
