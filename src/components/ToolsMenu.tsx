// src/components/ToolsMenu.tsx

import React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from '@/components/ui/button';
import { toolArray, iconMap } from '@/constants/tools';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Info, Mail, LogIn, LogOut, User, FileQuestion } from 'lucide-react';

export const ToolsMenu = () => {
  const { user, logout } = useAuth();

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>All PDF Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {toolArray.map((tool) => {
                const Icon = iconMap[tool.icon] || FileQuestion;
                return (
                  <ListItem
                    key={tool.label}
                    title={tool.label}
                    href={`/${tool.value}`}
                    icon={<Icon className="h-5 w-5 mr-3" style={{ color: tool.color }} aria-hidden="true" />}
                  >
                    {tool.description.split('.')[0]}.
                  </ListItem>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contact" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Mail className="mr-2 h-4 w-4" /> Contact
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <Info className="mr-2 h-4 w-4" /> About Us
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        {user ? (
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
          <NavigationMenuItem>
            <Link href="/login" passHref>
               <Button variant="outline" className="ml-4">
                 <LogIn className="mr-2 h-4 w-4" />
                 Login
               </Button>
            </Link>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// --- THIS IS THE FIX ---
// The correct JSX has been restored inside this component.
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center text-sm font-medium leading-none">
            {icon}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground pl-8">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
