// src/components/AuthNavMenu.tsx

"use client"; // Mark this component as client-side only

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, LogOut, User } from 'lucide-react';
import { NavigationMenuItem } from "@/components/ui/navigation-menu";

export const AuthNavMenu = () => {
  const { user, loading, logout } = useAuth();

  // On initial client render, loading is true, so we render a placeholder to prevent layout shift
  if (loading) {
    return (
      <NavigationMenuItem className="ml-4">
        <div className="h-10 w-24 bg-muted animate-pulse rounded-md" />
      </NavigationMenuItem>
    );
  }

  return (
    <>
      {user ? (
        // If user is logged in
        <>
          <NavigationMenuItem>
            <span className="flex items-center text-sm font-medium text-muted-foreground ml-4">
              <User className="mr-2 h-4 w-4"/> {user.email}
            </span>
          </NavigationMenuItem>
          <NavigationMenuItem>
             <Button variant="outline" className="ml-4" onClick={logout}>
               <LogOut className="mr-2 h-4 w-4" />
               Logout
             </Button>
          </NavigationMenuItem>
        </>
      ) : (
        // If user is logged out
        <NavigationMenuItem className="ml-4">
          <Button asChild>
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Link>
          </Button>
        </NavigationMenuItem>
      )}
    </>
  );
};
