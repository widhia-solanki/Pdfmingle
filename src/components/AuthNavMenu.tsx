// src/components/AuthNavMenu.tsx

"use client"; // Mark this component as client-side only

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSession, signIn, signOut } from 'next-auth/react';
import { LogIn, LogOut, User } from 'lucide-react';
import { NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserNav } from './UserNav';

export const AuthNavMenu = () => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const user = session?.user;

  // While loading, show a placeholder to prevent layout shift
  if (loading) {
    return (
      <NavigationMenuItem className="ml-4">
        <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
      </NavigationMenuItem>
    );
  }

  return (
    <>
      {user ? (
        // If user is logged in, show the UserNav dropdown
        <NavigationMenuItem className="ml-4">
          <UserNav />
        </NavigationMenuItem>
      ) : (
        // If user is logged out, show the Login button
        <NavigationMenuItem className="ml-4">
          <Button asChild>
            <Link href="/api/auth/signin" onClick={(e) => { e.preventDefault(); signIn('google'); }}>
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        </NavigationMenuItem>
      )}
    </>
  );
};
