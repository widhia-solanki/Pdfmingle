import * as React from "react";
import Link from "next/link"; // 1. CORRECT IMPORT

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { tools } from "@/constants/tools";
import { cn } from "@/lib/utils";

export const DesktopNav = () => {
  const organizeTools = tools.filter(t => t.category === "Organize");
  const optimizeTools = tools.filter(t => t.category === "Optimize");
  // ... add other categories if you want them in the dropdown

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Organize PDF</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {organizeTools.map((tool) => (
                <ListItem
                  key={tool.label}
                  title={tool.label}
                  href={`/${tool.value}`} // 2. USE 'href' INSTEAD OF 'to'
                >
                  {tool.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Optimize PDF</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {optimizeTools.map((tool) => (
                <ListItem
                  key={tool.label}
                  title={tool.label}
                  href={`/${tool.value}`} // 2. USE 'href' INSTEAD OF 'to'
                >
                  {tool.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* Add other menu items here */}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

// This ListItem component uses 'Link' from Next.js now
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!} // Make sure href is not undefined
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
