// src/components/InformativePanel.tsx

import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';
import React from 'react';

const RedditIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor"><title>Reddit</title><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.34.34 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 14.5c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm5.5 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm.29-3.36c-.764 0-1.38-.616-1.38-1.38 0-.764.616-1.38 1.38-1.38.764 0 1.38.616 1.38 1.38 0 .764-.616 1.38-1.38 1.38zm-5.58 0c-.764 0-1.38-.616-1.38-1.38 0-.764.616-1.38 1.38-1.38.764 0 1.38.616 1.38 1.38 0 .764-.616 1.38-1.38 1.38z"/></svg>
);

// --- THIS IS THE NEW, CLEANER DISCORD ICON ---
const DiscordIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor">
        <title>Discord</title>
        <path d="M19.54 0c1.356 0 2.46 1.104 2.46 2.472v19.056c0 1.368-1.104 2.472-2.46 2.472h-15.08c-1.356 0-2.46-1.104-2.46-2.472v-19.056c0-1.368 1.104-2.472 2.46-2.472h15.08zm-2.822 6.168c-1.04-.552-2.112-.948-3.216-1.164.036.12.06.252.084.384.564.228.984.54 1.356.9.024.024.036.06.036.084.012.048.012.096 0 .144-.012.024-.024.048-.036.072-.012.012-.024.024-.036.036-2.076 1.344-4.884 1.344-6.96 0-.012-.012-.024-.024-.036-.036a.25.25 0 0 1-.036-.072c-.012-.048-.012-.096 0-.144a.213.213 0 0 1 .036-.084c.372-.36.792-.672 1.356-.9.024-.132.048-.264.084-.384-1.104.216-2.172.612-3.216 1.164-3.276 1.752-4.464 5.232-4.464 8.724 0 3.864 2.4 7.044 5.436 7.044h1.932c.228.432.552.828.948 1.176a.34.34 0 0 0 .528 0c.396-.348.72-.744.948-1.176h1.932c3.036 0 5.436-3.18 5.436-7.044 0-3.492-1.188-6.972-4.464-8.724zm-7.248 8.16c-1.02 0-1.848-.84-1.848-1.884 0-1.044.828-1.884 1.848-1.884 1.032 0 1.86.84 1.86 1.884 0 1.044-.828 1.884-1.86 1.884zm4.452 0c-1.02 0-1.848-.84-1.848-1.884 0-1.044.828-1.884 1.848-1.884 1.032 0 1.86.84 1.86 1.884 0 1.044-.828 1.884-1.86 1.884z"/>
    </svg>
);

export const InformativePanel = () => {
    return (
        <section className="w-full py-16 md:py-24 border-t bg-white dark:bg-dark-bg dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-dark-text-primary">PDFMingle</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:underline text-gray-600 dark:text-dark-text-secondary hover:text-brand-blue">Home</Link></li>
                            <li><Link href="/about" className="hover:underline text-gray-600 dark:text-dark-text-secondary hover:text-brand-blue">About Us</Link></li>
                            <li><Link href="/blog" className="hover:underline text-gray-600 dark:text-dark-text-secondary hover:text-brand-blue">Blog</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-dark-text-primary">LEGAL</h4>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="hover:underline text-gray-600 dark:text-dark-text-secondary hover:text-brand-blue">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:underline text-gray-600 dark:text-dark-text-secondary hover:text-brand-blue">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-dark-text-primary">HELP</h4>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="hover:underline text-gray-600 dark:text-dark-text-secondary hover:text-brand-blue">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg text-gray-800 dark:text-dark-text-primary">Follow Us</h4>
                        <ul className="flex items-center space-x-4">
                           <li>
                                <a 
                                  href="https://www.reddit.com/u/PDFMingle_net/s/GfiIBMsyHc"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Follow us on Reddit"
                                  className="text-gray-600 dark:text-dark-text-secondary hover:text-brand-blue transition-colors"
                                >
                                  <RedditIcon />
                                </a>
                           </li>
                           <li>
                                <a 
                                  href="https://discord.gg/BXtASTaN"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Join our Discord server"
                                  className="text-gray-600 dark:text-dark-text-secondary hover:text-brand-blue transition-colors"
                                >
                                  <DiscordIcon />
                                </a>
                           </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-gray-500 dark:text-dark-text-secondary text-lg font-medium group">
                        Made with <button className="inline-block text-red-500 transition-transform group-hover:scale-125 animate-heartbeat">❤️</button> in India
                    </p>
                    <ThemeSwitcher />
                </div>
            </div>
        </section>
    );
};
