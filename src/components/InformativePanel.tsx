import Link from 'next/link';

// A new component for the Reddit SVG Icon
const RedditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor" // The fill color will be inherited from the parent's text color
    className="w-8 h-8"
  >
    <path d="M12,0C5.373,0,0,5.373,0,12c0,5.088,3.134,9.428,7.5,11.247L7.5,24l3.75-1.5 c0.5,0.083,1,0.142,1.5,0.142c6.627,0,12-5.373,12-12S18.627,0,12,0z M12,20.25c-0.621,0-1.125-0.504-1.125-1.125 s0.504-1.125,1.125-1.125s1.125,0.504,1.125,1.125S12.621,20.25,12,20.25z M15.75,13.5c-1.105,0-2-0.895-2-2 s0.895-2,2-2s2,0.895,2,2S16.855,13.5,15.75,13.5z M8.25,13.5c-1.105,0-2-0.895-2-2s0.895-2,2-2s2,0.895,2,2 S9.355,13.5,8.25,13.5z M16.5,8.25H7.5V6.75h9V8.25z"></path>
  </svg>
);

export const InformativePanel = () => {
    return (
        <section className="w-full py-16 md:py-24 border-t">
            <div className="container mx-auto px-4 text-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-800">
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">PDFMingle</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="hover:underline text-gray-600 hover:text-red-500">Home</Link></li>
                            <li><Link href="/about" className="hover:underline text-gray-600 hover:text-red-500">About Us</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">LEGAL</h4>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="hover:underline text-gray-600 hover:text-red-500">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:underline text-gray-600 hover:text-red-500">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">HELP</h4>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="hover:underline text-gray-600 hover:text-red-500">Contact Us</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-bold text-lg">Follow Us</h4>
                        {/* --- THIS IS THE FIX --- */}
                        <ul className="space-y-2 flex items-center justify-center">
                           <li>
                                <a 
                                  href="https://www.reddit.com/u/PDFMingle_net/s/GfiIBMsyHc"
                                  target="_blank" // Opens in a new tab
                                  rel="noopener noreferrer" // Security best practice for external links
                                  aria-label="Follow us on Reddit"
                                  className="text-gray-600 hover:text-red-500 transition-colors"
                                >
                                  {/* A simplified Reddit SVG icon */}
                                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="currentColor"><title>Reddit</title><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.34.34 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 14.5c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm5.5 0c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm.29-3.36c-.764 0-1.38-.616-1.38-1.38 0-.764.616-1.38 1.38-1.38.764 0 1.38.616 1.38 1.38 0 .764-.616 1.38-1.38 1.38zm-5.58 0c-.764 0-1.38-.616-1.38-1.38 0-.764.616-1.38 1.38-1.38.764 0 1.38.616 1.38 1.38 0 .764-.616 1.38-1.38 1.38z"/></svg>
                                </a>
                           </li>
                           {/* You can add more social media links here in the future */}
                        </ul>
                        {/* --- END OF THE FIX --- */}
                    </div>
                </div>
            </div>
        </section>
    );
};
