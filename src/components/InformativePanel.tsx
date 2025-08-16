import Link from 'next/link';

export const InformativePanel = () => {
    return (
        // The dark background image has been removed. 
        // It now sits on the default light gray page background.
        <section className="w-full py-16 md:py-24 border-t">
            <div className="container mx-auto px-4 text-center">
                {/* 
                  --- THIS IS THE FIX ---
                  Text colors are changed from 'text-white' to 'text-gray-800' and 'text-gray-600'
                  for better readability on a light background.
                */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-800">
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">PDFMingle</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:underline text-gray-600 hover:text-ilovepdf-red">Home</Link></li>
                            <li><Link href="/about" className="hover:underline text-gray-600 hover:text-ilovepdf-red">About Us</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">LEGAL</h4>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="hover:underline text-gray-600 hover:text-ilovepdf-red">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:underline text-gray-600 hover:text-ilovepdf-red">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">HELP</h4>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="hover:underline text-gray-600 hover:text-ilovepdf-red">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">Follow Us</h4>
                        {/* Add social media links here later */}
                    </div>
                </div>
            </div>
        </section>
    );
};
