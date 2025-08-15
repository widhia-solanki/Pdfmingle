import Head from 'next/head';

const TermsPage = () => {
  return (
    <>
      <Head>
        <title>Terms and Conditions - PDFMingle</title>
        <meta name="description" content="Read the terms and conditions for using PDFMingle's services." />
      </Head>
      <div className="prose max-w-4xl mx-auto py-8">
        <h1>Terms and Conditions</h1>
        <p>Last updated: August 15, 2025</p>
        
        <p>Please read these terms and conditions carefully before using Our Service.</p>

        <h2>Interpretation and Definitions</h2>
        <p>The words of which the initial letter is capitalized have meanings defined under the following conditions...</p>

        <h2>Acknowledgment</h2>
        <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
        <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>

        <h2>User Files</h2>
        <p>Our service allows you to upload and process files. We are committed to protecting the privacy and security of your files. All files uploaded to PDFMingle are automatically deleted from our servers within a few hours. We do not access, copy, or share your files.</p>

        <h2>Limitation of Liability</h2>
        <p>To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever...</p>

        <h2>Governing Law</h2>
        <p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service...</p>
        
        <h2>Contact Us</h2>
        <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
        <ul>
          <li>By email: support@xwayproducts.com</li>
        </ul>
      </div>
    </>
  );
};

export default TermsPage;
