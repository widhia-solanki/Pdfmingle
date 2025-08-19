// next-sitemap.config.js

// Import the list of your tools to make the sitemap dynamic
const { tools } = require('./src/constants/tools.js');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://pdfmingle.net',
  generateRobotsTxt: true, // This will create a robots.txt file
  
  // Custom transformation to add priority and changefreq
  transform: async (config, path) => {
    let priority = 0.7; // Default priority
    
    if (path === '/') {
      priority = 1.0;
    } else if (tools.some(tool => `/${tool.value}` === path)) {
      priority = 0.9;
    } else if (path.startsWith('/blog/')) {
      priority = 0.8;
    }
    
    return {
      loc: path, // The URL path
      changefreq: 'weekly',
      priority: priority,
      lastmod: new Date().toISOString(), // Use current date for last modification
    };
  },

  // Optional: Add any pages to exclude from the sitemap
  // exclude: ['/secret-page'],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*', // Allow all crawlers
        allow: '/',
      },
    ],
    // The sitemap URL will be automatically added, but you can add more here if needed
    // additionalSitemaps: [
    //   'https://pdfmingle.net/server-sitemap.xml',
    // ],
  },
};
```*Note: I had to change this file to `.js` and use `require` because your project doesn't have ES modules configured for Node.js scripts by default. This is the standard approach.*

### **Step 3: Update the `build` script in `package.json`**

Finally, we need to tell Vercel to run the sitemap generator **after** the build is complete.

1.  Navigate back to your `package.json` file and click **Edit**.
2.  Add a new script called `postbuild`. This special script automatically runs after the `build` script finishes.

Your `"scripts"` section should look like this:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "postbuild": "next-sitemap",
    "start": "next start",
    "lint": "next lint"
  },
