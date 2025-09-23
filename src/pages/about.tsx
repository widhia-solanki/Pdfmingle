// src/pages/about.tsx

import { Zap, Users, Shield, Lightbulb, Mail, Globe, Linkedin } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="animate-in fade-in duration-500 bg-background">
      {/* Hero Section - Dark by design, text is already light */}
      <section className="bg-gray-900 text-white text-center py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            About Pdfmingle
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Innovating for a simpler, smarter digital world.
          </p>
        </div>
      </section>

      {/* Who We Are Section - Use semantic colors */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Who We Are
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
            DAFDA Products is a forward-thinking technology company committed to creating simple, powerful, and accessible digital solutions for people and businesses worldwide. We believe that technology should empower everyone — making daily tasks faster, easier, and smarter. Our flagship product, <strong className="font-semibold text-brand-blue">PDF</strong>Mingle, is designed to give you a seamless, efficient, and secure way to work with PDF files — whether you need to merge, split, compress, or convert them.
          </p>
        </div>
      </section>

      {/* Vision & Mission Section - Use semantic colors */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 max-w-5xl">
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-foreground mb-3">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To become a trusted global leader in productivity tools by delivering innovation, reliability, and a user-friendly experience for everyone.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-foreground mb-3">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              We aim to create tools that remove complexity and put control back in the hands of users. Every feature we build is focused on speed, simplicity, and security — because your time and privacy matter.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section - Use semantic colors */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-foreground">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Dr. Bhagirathchand Solanki</h3>
                <p className="font-semibold text-red-500">Owner</p>
                <p className="text-muted-foreground leading-relaxed">
                  Dr. Solanki takes care of the expenses and resources required to keep the website running. He ensures that the platform remains active, reliable, and accessible for users. His support helps maintain smooth operations, regular updates, and continued improvements for PDFMingle.
            </div>
            <div className="space-y-3 flex flex-col items-center">
                <h3 className="text-2xl font-bold text-foreground">Widhia Solanki</h3>
                <p className="font-semibold text-red-500">Founder</p>
                <p className="text-muted-foreground leading-relaxed">
                 Widhia Solanki founded PDFMingle at the age of 18. With strong technical skills, she aims to help students, professionals, and businesses manage documents more efficiently, believing that age doesn't limit the ability to create impactful technology.
                </p>
                <a 
                  href="https://www.linkedin.com/in/widhia-solanki-69a901336/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-brand-blue hover:text-brand-blue-dark font-semibold transition-colors"
                >
                    <Linkedin className="h-5 w-5" />
                    Connect with our Founder
                </a>
            </div>
            <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">Eshan Solanki</h3>
                <p className="font-semibold text-red-500">Developer</p>
                <p className="text-muted-foreground leading-relaxed">
                  Eshan Solanki, a 15-year-old high school student, is passionate about coding and has made significant contributions to the development of PDFMingle, shaping its user experience early in his journey.
                </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Use semantic colors */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-500 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Fast & Reliable</h4>
            </div>
            <div className="text-center">
              <div className="bg-red-500 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">User-Friendly</h4>
            </div>
            <div className="text-center">
              <div className="bg-red-500 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Secure</h4>
            </div>
            <div className="text-center">
              <div className="bg-red-500 text-white rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">Innovation Driven</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section - Use semantic colors */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Contact Us
          </h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-12 mt-6">
            <a href="mailto:contact.dafda.pdfmingle@gmail.com" className="flex items-center gap-3 text-lg text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-6 w-6" />
              <span>contact.dafda.pdfmingle@gmail.com</span>
            </a>
            <a href="https://pdfmingle.net" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg text-muted-foreground hover:text-primary transition-colors">
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
