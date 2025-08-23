// src/components/DesktopNav.tsx

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { toolArray } from "@/constants/tools"; // FIX: Import toolArray instead of tools
import { cn } from "@/lib/utils";

export const DesktopNav = () => {
  // FIX: Use toolArray for filtering
  const organizeTools = toolArray.filter(t => t.category === "Organize");
  const optimizeTools = toolArray.filter(t => t.category === "Optimize");
  const convertTools = toolArray.filter(t => t.category === "Convert");
  const editTools = toolArray.filter(t => t.category === "Edit");
  const securityTools = toolArray.filter(t => t.category === "Security");


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
                  href={`/${tool.value}`}
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
                  href={`/${tool.value}`}
                >
                  {tool.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Convert PDF</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {convertTools.map((tool) => (
                <ListItem
                  key={tool.label}
                  title={tool.label}
                  href={`/${tool.value}`}
                >
                  {tool.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger>Edit PDF</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {editTools.map((tool) => (
                <ListItem
                  key={tool.label}
                  title={tool.label}
                  href={`/${tool.value}`}
                >
                  {tool.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Security</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {securityTools.map((tool) => (
                <ListItem
                  key={tool.label}
                  title={tool.label}
                  href={`/${tool.value}`}
                >
                  {tool.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href!}
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
