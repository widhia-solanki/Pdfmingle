import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => (
  <svg
    className={cn(className)}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Top-left green part */}
    <path d="M50 0 L20 0 L0 20 L0 50 L30 50 L50 30 Z" fill="#10B981" />
    {/* Top-right blue part */}
    <path d="M50 0 L80 0 L100 20 L100 50 L70 50 L50 30 Z" fill="#3B82F6" />
    {/* Bottom-left blue part */}
    <path d="M50 100 L20 100 L0 80 L0 50 L30 50 L50 70 Z" fill="#2563EB" />
    {/* Bottom-right green part */}
    <path d="M50 100 L80 100 L100 80 L100 50 L70 50 L50 70 Z" fill="#6EE7B7" />
  </svg>
);
