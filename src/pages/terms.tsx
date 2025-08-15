import Head from 'next/head';

const TermsPage = () => {
  return (
    <>
      <Head>
        <title>Terms and Conditions - PDFMingle</title>
        <meta name="description" content="Read the Terms and Conditions for using PDFMingle's online PDF tools." />
      </Head>
      <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-ilovepdf-text">Terms and Conditions</h1>
          <p className="mt-2 text-gray-500">Effective Date: 15-08-2025</p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed text-left">
          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">1. Acceptance of Terms</h2>
            <p>By accessing or using PDFMingle (https://pdfmingle.vercel.app), owned by X-Way Products Private Limited (“we,” “our,” “us”), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">2. Description of Service</h2>
            <p>PDFMingle provides online tools for processing PDF files, including but not limited to merging, splitting, compressing, converting, and editing PDFs. We may modify, suspend, or discontinue any part of the service without prior notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">3. Eligibility</h2>
            <p>You must be at least 13 years old to use our services. By using the site, you confirm that you meet this requirement.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">4. User Responsibilities</h2>
            <p>When using PDFMingle, you agree:</p>
            <ul className="list-disc list-inside mt-2 pl-4 space-y-1">
              <li>Not to upload, share, or process content that is illegal, harmful, or violates the rights of others.</li>
              <li>To ensure that you have the necessary rights and permissions to use the files you upload.</li>
              <li>Not to misuse the platform for malicious purposes, such as distributing malware.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">5. File Handling & Privacy</h2>
            <p>Uploaded files are processed automatically and are not stored longer than necessary for operation. We do not manually review your files unless required by law. It is your responsibility to maintain backups of your original files.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">6. Subscription & Payments</h2>
            <p>PDFMingle offers both free and premium subscription plans. Premium subscriptions are billed according to the plan you choose (monthly or yearly). Payments are non-refundable except where required by law. We reserve the right to change pricing with prior notice.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">7. Advertisements</h2>
            <p>Free users may see advertisements on the website. We are not responsible for the content, accuracy, or reliability of third-party ads.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">8. Intellectual Property</h2>
            <p>All content, trademarks, and code on PDFMingle belong to us unless otherwise stated. You may not copy, modify, or distribute our platform’s content without prior written consent.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">9. Limitation of Liability</h2>
            <p>PDFMingle is provided “as is” without any warranties. We are not responsible for any loss of data, business interruption, or damages resulting from your use of our services.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">10. Termination</h2>
            <p>We reserve the right to suspend or terminate your access to the service if you violate these terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">11. Changes to Terms</h2>
            <p>We may update these Terms and Conditions at any time. Continued use of the site means you accept the updated terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-ilovepdf-text">12. Governing Law</h2>
            <p>These Terms and Conditions shall be governed by and interpreted according to the laws of India/Gujarat.</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
