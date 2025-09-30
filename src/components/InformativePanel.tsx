// src/components/InformativePanel.tsx

import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';
import React from 'react';

const RedditIcon = () => ( <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor"><title>Reddit</title><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.34.34 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 14.5c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm5.5 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm.29-3.36c-.764 0-1.38-.616-1.38-1.38 0-.764.616-1.38 1.38-1.38.764 0 1.38.616 1.38 1.38 0 .764-.616 1.38-1.38 1.38zm-5.58 0c-.764 0-1.38-.616-1.38-1.38 0-.764.616-1.38 1.38-1.38.764 0 1.38.616 1.38 1.38 0 .764-.616 1.38-1.38 1.38z"/></svg> );
const DiscordIcon = () => ( <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor"><title>Discord</title><path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.352-.438.704-.638 1.057a18.168 18.168 0 00-1.622.388 16.273 16.273 0 00-4.922 0 18.168 18.168 0 00-1.622-.388c-.2-.353-.428-.705-.638-1.057a.074.074 0 00-.08-.037 19.791 19.791 0 00-4.885 1.515.069.069 0 00-.052.065A18.455 18.455 0 00.323 13.535a.076.076 0 00.042.083c1.94.576 3.765.98 5.49 1.155a.075.075 0 00.081-.022c.207-.25.405-.515.59-.795a.075.075 0 00-.042-.105c-.652-.249-1.27-.533-1.857-.845a.076.076 0 01-.01-.115 16.192 16.192 0 00-1.16-1.246.075.075 0 01.01-.116 16.512 16.512 0 013.258-2.02.078.078 0 01.088.02c.463.59.894 1.223 1.294 1.895a.075.075 0 00.088.01c.73-.342 1.486-.64 2.254-.872a.075.075 0 00.043-.133 17.226 17.226 0 00-.592-2.155.076.076 0 01.02-.093c.189-.138.38-.276.57-.411a.075.075 0 01.096.004c.19.135.38.273.57.411a.076.076 0 01.02.093 17.226 17.226 0 00-.592 2.155.075.075 0 00.043.133c.768.232 1.524.53 2.254.872a.075.075 0 00.088-.01c.4-.672.831-1.305 1.294-1.895a.078.078 0 01.088-.02 16.512 16.512 0 013.258 2.02.075.075 0 01.01.116 16.192 16.192 0 00-1.16 1.246.076.076 0 01-.01.115c-.587.312-1.205.596-1.857.845a.075.075 0 00-.042.105c.185.28.383.545.59.795a.075.075 0 00.081.022c1.725-.175 3.55-.579 5.49-1.155a.076.076 0 00.042-.083 18.455 18.455 0 00-3.34-8.91.069.069 0 00-.052-.065zM8.02 15.33c-1.183 0-2.156-.975-2.156-2.176 0-1.2 1.002-2.176 2.156-2.176 1.184 0 2.156.976 2.156 2.176 0 1.201-.972 2.176-2.156 2.176zm7.964 0c-1.183 0-2.156-.975-2.156-2.176 0-1.2 1.002-2.176 2.156-2.176 1.184 0 2.156.976 2.156 2.176 0 1.201-1.002 2.176-2.156 2.176z"/></svg> );

export const InformativePanel = () => {
    return (
        <section className="w-full py-16 md:py-24 border-t border-border bg-secondary">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-foreground">PDFMingle</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-muted-foreground hover:text-primary hover:underline">Home</Link></li>
                            <li><Link href="/tools" className="text-muted-foreground hover:text-primary hover:underline">All Tools</Link></li>
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary hover:underline">About Us</Link></li>
                            <li><Link href="/blog" className="text-muted-foreground hover:text-primary hover:underline">Blog</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-foreground">LEGAL</h4>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="text-muted-foreground hover:text-primary hover:underline">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-muted-foreground hover:text-primary hover:underline">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-foreground">HELP</h4>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary hover:underline">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-foreground">Follow Us</h4>
                        <div className="flex items-center space-x-2">
                           <a href="https://www.reddit.com/u/PDFMingle_net/s/GfiIBMsyHc" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Reddit" className="flex items-center justify-center h-10 w-10 bg-muted rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"><RedditIcon /></a>
                           <a href="https://discord.gg/BXtASTaN" target="_blank" rel="noopener noreferrer" aria-label="Join our Discord server" className="flex items-center justify-center h-10 w-10 bg-muted rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"><DiscordIcon /></a>
                        </div>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
                    <p className="text-muted-foreground text-sm group">
                        Made with <span className="inline-block text-red-500 transition-transform group-hover:scale-125 animate-heartbeat">❤️</span> in India
                    </p>
                    <ThemeSwitcher />
                </div>
            </div>
        </section>
    );
};
