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
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const DesktopNav = () => {
  const convertTools = tools.filter(t => t.category === 'Convert');
  const allTools = tools; // For the "All PDF Tools" dropdown

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Single Links */}
        <NavigationMenuItem>
          <Link to="/merge" className={navigationMenuTriggerStyle()}>
            MERGE PDF
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/split" className={navigationMenuTriggerStyle()}>
            SPLIT PDF
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/compress" className={navigationMenuTriggerStyle()}>
            COMPRESS PDF
          </Link>
        </NavigationMenuItem>
        
        {/* Convert PDF Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>CONVERT PDF</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {convertTools.map((tool) => (
                <ListItem key={tool.label} to={`/${tool.value}`} title={tool.label}>
                  {tool.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* All PDF Tools Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger>ALL PDF TOOLS</NavigationMenuTrigger>
          <NavigationMenuContent>
             <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {allTools.map((tool) => (
                <ListItem key={tool.label} to={`/${tool.value}`} title={tool.label}>
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

// A helper component for styling the dropdown items
const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { title: string }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={to}
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
