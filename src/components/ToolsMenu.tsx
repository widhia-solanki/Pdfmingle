// src/components/ToolsMenu.tsx

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { toolArray, iconMap } from '@/constants/tools';
import { cn } from '@/lib/utils';
import { Info, Mail, FileQuestion } from 'lucide-react';

// Dynamically import the UserNav to prevent SSR issues with the useSession hook
const UserNavWithNoSSR = dynamic(
  () => import('./UserNav').then((mod) => mod.UserNav),
  { 
    ssr: false,
    loading: () => <div className="ml-4 h-10 w-10 bg-muted animate-pulse rounded-full" /> 
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
                    icon={<Icon className="h-5 w-5" style={{ color: tool.color }} />}
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
        
        <UserNavWithNoSSR />

      </NavigationMenuList>
    </NavigationMenu>
  );
};

// --- THIS IS THE FIX ---
// The ListItem component is now corrected to properly render the icon and text.
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "flex items-start p-3 space-x-4 rounded-md no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          {/* Icon is now rendered in its own div for proper alignment */}
          <div className="flex-shrink-0 mt-1">{icon}</div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">{title}</p>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
