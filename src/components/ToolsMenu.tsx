// src/components/ToolsMenu.tsx

import React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  // ... other navigation menu imports
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar components
import { toolArray, iconMap } from '@/constants/tools';
import { useSession, signIn, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Info, Mail, LogIn, LogOut, FileQuestion } from 'lucide-react';

export const ToolsMenu = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = session?.user;

  // Helper to get the user's initials for the avatar fallback
  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="items-center">
        {/* ... (All PDF Tools, Contact, and About links remain the same) ... */}
        
        <NavigationMenuItem className="ml-4">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              <div className="h-6 w-24 bg-muted animate-pulse rounded-md" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              {/* --- THIS IS THE NEW AVATAR --- */}
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  {user.image && <AvatarImage src={user.image} alt={user.name || 'User Avatar'} />}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-muted-foreground hidden lg:block">
                  {user.name || user.email}
                </span>
              </div>
              <Button variant="outline" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button asChild>
              <Link href="/login" onClick={(e) => { e.preventDefault(); signIn('google'); }}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// ... (ListItem component remains the same)
