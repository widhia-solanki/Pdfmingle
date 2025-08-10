import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

// A list of your site's features.
const features = [
  "Merge PDF",
  "Split PDF",
  "Rotate PDF",
  "Compress PDF",
  "Word to PDF",
  "PDF to Word",
];

export const ThreeDotsMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 active:bg-white/20">
          <MoreVertical className="h-6 w-6" />
          <span className="sr-only">Open features menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Site Features</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {features.map((feature) => (
          <DropdownMenuItem key={feature}>{feature}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
