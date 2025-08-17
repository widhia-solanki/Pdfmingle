import { Zap, Users, Shield, Lightbulb, Mail, Globe } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            About DAFDA Products
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Innovating for a simpler, smarter digital world.
          </p>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Who We Are
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-gray-600">
            DAFDA Products is a forward-thinking technology company committed to creating simple, powerful, and accessible digital solutions for people and businesses worldwide. We believe that technology should empower everyone — making daily tasks faster, easier, and smarter. Our flagship product, <strong className="font-semibold text-red-500">PDFMingle</strong>, is designed to give you a seamless, efficient, and secure way to work with PDF files — whether you need to merge, split, compress, or convert them.
          </p>
        </div>
      </section>

      {/* 3. Vision & Mission Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 max-w-5xl">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become a trusted global leader in productivity tools by delivering innovation, reliability, and a user-friendly experience for everyone.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              We aim to create tools that remove complexity and put control back in the hands of users. Every feature we build is focused on speed, simplicity, and security — because your time and privacy matter.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Meet Our Team Section (UPDATED) */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Owner */}
            <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">Dr. Bhagirathchand Solanki</h3>
                <p className="font-semibold text-red-500">Owner</p>
                <p className="text-gray-600 leading-relaxed">
                  With a profound background in strategic leadership and business development, Dr. Solanki provides the foundational vision and resources that empower DAFDA Products to thrive and innovate.
                </p>
            </div>
            {/* Founder */}
            <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">Widhia Solanki</h3>
                <p className="font-semibold text-red-500">Founder</p>
                <p className="text-gray-600 leading-relaxed">
                  As the founder, Widhia established the core mission of creating user-centric technology. Her passion for simplifying complex problems is the driving force behind the intuitive design of PDFMingle.
                </p>
            </div>
            {/* Developer */}
            <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-800">Eshan Solanki</h3>
                <p className="font-semibold text-red-500">Developer</p>
                <p className="text-gray-600 leading-relaxed">
                  Eshan is the architect and lead developer of PDFMingle. With a strong background in technology and a drive for excellence, he leads the development with innovation, precision, and a customer-first approach.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-500 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Fast & Reliable</h4>
            </div>
            <div className="text-center">
              <div className="bg-red-500 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">User-Friendly</h4>
            </div>
            <div className="text-center">
              <div className="bg-red-500 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Secure</h4>
            </div>
            <div className="text-center">
              <div className="bg-red-500 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Innovation Driven</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contact Us Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
            Contact Us
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-12 mt-6">
            <a href="mailto:contact.dafda.pdfmingle@gmail.com" className="flex items-center gap-3 text-lg text-gray-600 hover:text-red-500 transition-colors">
              <Mail className="h-6 w-6" />
              <span>contact.dafda.pdfmingle@gmail.com</span>
            </a>
            <a href="https://pdfmingle.net" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg text-gray-600 hover:text-red-500 transition-colors">
              <Globe className="h-6 w-6" />
              <span>pdfmingle.net</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
