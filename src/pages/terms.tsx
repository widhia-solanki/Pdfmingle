// src/pages/terms.tsx

import Head from 'next/head';

const TermsPage = () => {
  return (
    <>
      <Head>
        <title>Terms and Conditions - PDFMingle</title>
        <meta name="description" content="Read the terms and conditions for using PDFMingle's services." />
      </Head>
      
      <div className="animate-in fade-in duration-500 bg-background">
        <section className="bg-gray-900 text-white text-center py-20 md:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Terms and Conditions
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300">
              Last updated: August 15, 2025
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose dark:prose-invert lg:prose-xl mx-auto">
              <p>Please read these terms and conditions carefully before using Our Service.</p>

              <h2>Interpretation and Definitions</h2>
              <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

              <h2>Acknowledgment</h2>
              <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
              <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>

              <h2>User Files</h2>
              <p>Our service allows you to upload and process files. We are committed to protecting the privacy and security of your files. All files uploaded to PDFMingle are automatically deleted from our servers within a few hours. We do not access, copy, or share your files.</p>

              <h2>Limitation of Liability</h2>
              <p>To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever.</p>

              <h2>Contact Us</h2>
              <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
              <ul>
                <li>By email: contact.dafda.pdfmingle@gmail.com</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TermsPage;
