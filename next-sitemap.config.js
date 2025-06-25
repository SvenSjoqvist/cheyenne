const { getAllRoutes } = require('./scripts/sitemap-generator');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://testing.kilaeko.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Set to true if you have many URLs (>50k)
  
  // Define additional paths
  additionalPaths: async (config) => {
    try {
      const routes = await getAllRoutes();
      
      return routes.map((route) => ({
        loc: route.loc,
        lastmod: route.lastmod,
        changefreq: route.changefreq,
        priority: route.priority,
      }));
    } catch (error) {
      console.error('Error generating additional paths:', error);
      return [];
    }
  },
  
  // Exclude certain paths from sitemap
  exclude: [
    '/admin/*',
    '/dashboard/*',
    '/account/*',
    '/dashboard',
    '/api/*',
    '/private/*',
    '/_next/*',
    '/404',
    '/500',
    '/collections/runaway',
  ],
  
  // Robot.txt configuration
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/private', '/dashboard'],
      },
    ],
    additionalSitemaps: [
      // Add additional sitemaps if needed
      // 'https://yoursite.com/sitemap-images.xml',
    ],
  },
  
  // Transform function to modify each URL
  transform: async (config, path) => {
    // Default transform function
    return {
      loc: path,
      changefreq: 'daily',
      priority: 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
};