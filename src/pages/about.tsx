import{ Zap, Users, Shield, Lightbulb, Mail, Globe } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            About X-Way Products
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Innovating for a simpler, smarter digital world.
          </p>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ilovepdf-text">
            Who We Are
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-gray-600">
            X-Way Products Private Limited is a forward-thinking technology company committed to creating simple, powerful, and accessible digital solutions for people and businesses worldwide. We believe that technology should empower everyone — making daily tasks faster, easier, and smarter. Our flagship product, <strong className="font-semibold text-ilovepdf-red">PDFMingle</strong>, is designed to give you a seamless, efficient, and secure way to work with PDF files — whether you need to merge, split, compress, or convert them.
          </p>
        </div>
      </section>

      {/* 3. Vision & Mission Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 max-w-5xl">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-ilovepdf-text mb-3">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To become a trusted global leader in productivity tools by delivering innovation, reliability, and a user-friendly experience for everyone.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-ilovepdf-text mb-3">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              We aim to create tools that remove complexity and put control back in the hands of users. Every feature we build is focused on speed, simplicity, and security — because your time and privacy matter.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Meet Our Founder Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ilovepdf-text">
            Meet Our Founder
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-gray-600">
            <strong className="font-semibold text-ilovepdf-text">Eshan Solanki</strong>, CEO & Founder of X-Way Products Private Limited, is a passionate entrepreneur with a vision to make digital tools that are both high-performance and easy to use. With a strong background in technology and a drive for excellence, Eshan leads the company with innovation, precision, and a customer-first approach.
          </p>
        </div>
      </section>
      
      {/* 5. Why Choose Us Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-ilovepdf-text">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-ilovepdf-red text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Fast & Reliable</h4>
            </div>
            <div className="text-center">
              <div className="bg-ilovepdf-red text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">User-Friendly</h4>
            </div>
            <div className="text-center">
              <div className="bg-ilovepdf-red text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Secure</h4>
            </div>
            <div className="text-center">
              <div className="bg-ilovepdf-red text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-ilovepdf-text">
            Contact Us
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-12 mt-6">
            <a href="mailto:support@xwayproducts.com" className="flex items-center gap-3 text-lg text-gray-600 hover:text-ilovepdf-red transition-colors">
              <Mail className="h-6 w-6" />
              <span>support@xwayproducts.com</span>
            </a>
            <a href="https://www.pdfmingle.org" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg text-gray-600 hover:text-ilovepdf-red transition-colors">
              <Globe className="h-6 w-6" />
              <span>www.pdfmingle.org</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
