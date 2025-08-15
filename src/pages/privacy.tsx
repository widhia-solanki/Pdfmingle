import Head from 'next/head';

const PrivacyPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - PDFMingle</title>
        <meta name="description" content="Learn about how PDFMingle collects, uses, and protects your data." />
      </Head>
      <div className="prose max-w-4xl mx-auto py-8">
        <h1>Privacy Policy</h1>
        <p>Last updated: August 15, 2025</p>

        <p>X-Way Products Private Limited ("us", "we", or "our") operates the PDFMingle website (the "Service").</p>
        <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
        
        <h2>Information Collection and Use</h2>
        <p>We do not require you to create an account or provide any personal information to use our tools. We are committed to a privacy-first approach.</p>

        <h2>File Handling</h2>
        <p>We temporarily process the files you upload to perform the requested tool's function. All files are automatically and permanently deleted from our servers within a limited timeframe (e.g., 2 hours). We do not read, access, or store your files for any purpose other than to provide the service you requested.</p>
        
        <h2>Log Data</h2>
        <p>We may collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics. This data is used for analytics to improve our service and is not linked to any personally identifiable information.</p>

        <h2>Cookies</h2>
        <p>Cookies are files with a small amount of data, which may include an anonymous unique identifier. We use cookies to ensure the proper functioning of our site. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
        
        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us:</p>
        <ul>
          <li>By email: support@xwayproducts.com</li>
        </ul>
      </div>
    </>
  );
};

export default PrivacyPage;
