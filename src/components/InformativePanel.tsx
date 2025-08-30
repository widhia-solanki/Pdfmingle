// src/components/InformativePanel.tsx

import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitcher';

const RedditIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor"><title>Reddit</title><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.34.34 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 14.5c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm5.5 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm.29-3.36c-.764 0-1.38-.616-1.38-1.38 0-.764.616-1.38 1.38-1.38.764 0 1.38.616 1.38 1.38 0 .764-.616 1.38-1.38 1.38zm-5.58 0c-.764 0-1.38-.616-1.38-1.38 0-.764.616-1.38 1.38-1.38.764 0 1.38.616 1.38 1.38 0 .764-.616 1.38-1.38 1.38z"/></svg>
);

export const InformativePanel = () => {
    return (
        <section className="w-full py-16 md:py-24 border-t bg-white dark:bg-gray-900 dark:border-gray-800">
            <div className="container mx-auto px-4 text-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-800 dark:text-gray-200">
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">PDFMingle</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:underline text-gray-600 dark:text-gray-400 hover:text-brand-blue">Home</Link></li>
                            <li><Link href="/about" className="hover:underline text-gray-600 dark:text-gray-400 hover:text-brand-blue">About Us</Link></li>
                            <li><Link href="/blog" className="hover:underline text-gray-600 dark:text-gray-400 hover:text-brand-blue">Blog</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">LEGAL</h4>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="hover:underline text-gray-600 dark:text-gray-400 hover:text-brand-blue">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:underline text-gray-600 dark:text-gray-400 hover:text-brand-blue">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">HELP</h4>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="hover:underline text-gray-600 dark:text-gray-400 hover:text-brand-blue">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">Follow Us</h4>
                        <ul className="space-y-2 flex items-center justify-center">
                           <li>
                                <a 
                                  href="https://www.reddit.com/u/PDFMingle_net/s/GfiIBMsyHc"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Follow us on Reddit"
                                  className="text-gray-600 dark:text-gray-400 hover:text-brand-blue transition-colors"
                                >
                                  <RedditIcon />
                                </a>
                           </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    {/* --- THIS IS THE UPDATED SECTION --- */}
                    <p className="text-gray-500 dark:text-gray-400 text-base">
                        Made with <span className="inline-block animate-heartbeat">❤️</span> in India
                    </p>
                    <ThemeSwitcher />
                </div>
            </div>
        </section>
    );
};```
