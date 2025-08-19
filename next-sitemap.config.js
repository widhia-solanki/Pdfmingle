// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://pdfmingle.net',
  generateRobotsTxt: true, // This will create a robots.txt file
  
  // Custom transformation to add priority and changefreq
  transform: async (config, path) => {
    let priority = 0.7; // Default priority for pages like about, contact, etc.
    
    // Manually check if the path is a tool page
    const toolPages = [
      '/merge-pdf', '/split-pdf', '/compress-pdf', '/pdf-to-word', '/word-to-pdf',
      '/pdf-to-excel', '/excel-to-pdf', '/pdf-to-ppt', '/ppt-to-pdf', '/image-to-pdf',
      '/pdf-to-image', '/protect-pdf', '/unlock-pdf', '/rotate-pdf', '/esign-pdf',
      '/edit-pdf', '/organize-pdf'
    ];

    if (path === '/') {
      priority = 1.0;
    } else if (toolPages.includes(path)) {
      priority = 0.9;
    } else if (path.startsWith('/blog')) {
      priority = 0.8;
    }
    
    return {
      loc: path, // The URL path
      changefreq: 'weekly',
      priority: priority,
      lastmod: new Date().toISOString(), // Use current date for last modification
    };
  },

  // Add any pages to exclude from the sitemap
  exclude: [],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*', // Allow all crawlers
        allow: '/',
      },
    ],
  },
};
