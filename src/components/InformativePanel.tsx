import Link from 'next/link';

export const InformativePanel = () => {
    return (
        <section className="w-full bg-panel-bg bg-cover bg-center py-16 md:py-24 mt-16 md:mt-24">
            <div className="container mx-auto px-4 text-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">PDFMingle</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:underline opacity-80 hover:opacity-100">Home</Link></li>
                            <li><Link href="/about" className="hover:underline opacity-80 hover:opacity-100">About Us</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">LEGAL</h4>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="hover:underline opacity-80 hover:opacity-100">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:underline opacity-80 hover:opacity-100">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">HELP</h4>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="hover:underline opacity-80 hover:opacity-100">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">Follow Us</h4>
                        {/* Add social media links here later if you want */}
                    </div>
                </div>
            </div>
        </section>
    );
};
