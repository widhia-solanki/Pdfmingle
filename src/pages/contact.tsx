import Head from 'next/head';
import { Mail, Globe } from 'lucide-react';

const ContactPage = () => {
  return (
    <>
      <Head>
        <title>Contact Us - PDFMingle</title>
        <meta name="description" content="Get in touch with the PDFMingle team. We're here to help with any questions or feedback." />
      </Head>

      <div className="animate-in fade-in duration-500">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center py-20 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Get In Touch
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300">
              We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Contact Information</h2>
            <p className="text-lg text-gray-600 mb-10">
              For support, questions, or feedback, please reach out to us through one of the methods below.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 md:gap-16">
              <a href="mailto:contact.dafda.pdfmingle@gmail.com" className="flex items-center gap-3 text-xl text-gray-700 hover:text-red-500 transition-colors">
                <Mail className="h-8 w-8" />
                <span>contact.dafda.pdfmingle@gmail.com</span>
              </a>
              <a href="https://pdfmingle.net" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-xl text-gray-700 hover:text-red-500 transition-colors">
                <Globe className="h-8 w-8" />
                <span>pdfmingle.net</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactPage;
