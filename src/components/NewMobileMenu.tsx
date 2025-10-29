// src/components/NewMobileMenu.tsx

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, FileQuestion, Info, LogIn, LogOut, Mail } from "lucide-react";
import { toolArray, iconMap } from "@/constants/tools";
import Link from "next/link";
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

const PDFMingleLogo = () => (
    <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-foreground no-underline">
        <svg width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M50 0 L20 0 L0 20 L0 50 L30 50 L50 30 Z" fill="#10B981" /><path d="M50 0 L80 0 L100 20 L100 50 L70 50 L50 30 Z" fill="#3B82F6" /><path d="M50 100 L20 100 L0 80 L0 50 L30 50 L50 70 Z" fill="#2563EB" /><path d="M50 100 L80 100 L100 80 L100 50 L70 50 L50 70 Z" fill="#6EE7B7" /></svg>
        <div><span className="text-blue-600">PDF</span><span className="text-foreground">Mingle</span></div>
    </Link>
);

export const NewMobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const { user, loading, logout } = useAuth();

    const getInitials = (name: string | null | undefined) => {
        if (!name) return user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';
        const nameParts = name.split(' ');
        if (nameParts.length > 1) return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const handleLogoutClick = () => {
        setIsOpen(false);
        logout();
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild><Button variant="ghost" size="icon" className="text-foreground" aria-label="Open Menu"><Menu className="h-6 w-6" /></Button></SheetTrigger>
            <SheetContent side="left" className="p-0 bg-background/80 backdrop-blur-lg border-r border-border flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <PDFMingleLogo />
                    <SheetClose asChild><Button variant="ghost" size="icon" className="rounded-full text-foreground"><X className="h-6 w-6" /></Button></SheetClose>
                </div>
                <nav className="flex-grow overflow-y-auto p-4 space-y-2">
                    {user && (
                        <div className='flex items-center gap-3 px-3 pb-2'>
                            <Avatar>
                                {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />}
                                <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold text-foreground truncate">{user.displayName || 'User'}</p>
                                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="all-tools" className="border-b-0">
                            <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline p-3 -ml-3">All PDF Tools</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-1 border-l border-border ml-3 pl-4">
                                    {toolArray.map((tool) => {
                                        const Icon = iconMap[tool.icon] || FileQuestion;
                                        const isActive = router.pathname === `/${tool.value}`;
                                        return (<Link key={tool.value} href={`/${tool.value}`} onClick={() => setIsOpen(false)} className={cn("flex items-center gap-3 p-3 rounded-md transition-colors", isActive ? "bg-secondary text-primary font-semibold" : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground")}><Icon className="h-6 w-6" style={{ color: isActive ? 'hsl(var(--primary))' : tool.color }} /><span>{tool.label}</span></Link>);
                                    })}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Separator />
                    <div className="flex flex-col gap-1 px-3 pt-2">
                        {loading ? (<div className="h-12 w-full bg-muted animate-pulse rounded-md" />) : user ? (
                            <Button variant="outline" className="justify-start gap-3 p-3 h-auto text-muted-foreground" onClick={handleLogoutClick}><LogOut className="h-6 w-6" /><span className="font-medium">Logout</span></Button>
                        ) : (
                            // --- THIS IS THE FIX ---
                            // The button now correctly links to the /login page.
                            <Button asChild variant="outline" className="justify-start gap-3 p-3 h-auto text-muted-foreground">
                                <Link href="/login" onClick={() => setIsOpen(false)}>
                                    <LogIn className="h-6 w-6" /><span className="font-medium">Login</span>
                                </Link>
                            </Button>
                        )}
                        <Link href="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-md text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"><Mail className="h-6 w-6" /><span className="font-medium">Contact Us</span></Link>
                        <Link href="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 rounded-md text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"><Info className="h-6 w-6" /><span className="font-medium">About Us</span></Link>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
};
