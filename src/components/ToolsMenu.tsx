// src/components/ToolsMenu.tsx

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList, // --- THIS IS THE FIX ---
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { toolArray, iconMap } from '@/constants/tools';
import { cn } from '@/lib/utils';
import { Info, Mail, FileQuestion } from 'lucide-react';

// Dynamically import the AuthNavMenu to prevent SSR issues
const AuthNavMenuWithNoSSR = dynamic(
  () => import('./AuthNavMenu').then((mod) => mod.AuthNavMenu),
  { 
    ssr: false,
    loading: () => <div className="ml-4 h-10 w-24 bg-muted animate-pulse rounded-md" /> 
  }
);

export const ToolsMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="items-center">
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
        
        <AuthNavMenuWithNoSSR />

      </NavigationMenuList>
    </NavigationMenu>
  );
};

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
