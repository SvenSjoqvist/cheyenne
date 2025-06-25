const fs = require('fs');
const path = require('path');

/**
 * Recursively get all files from a directory
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  const publicDir = path.join(process.cwd(), 'public');
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      // Convert to web path (remove everything up to and including /public)
      const webPath = fullPath.replace(publicDir, '').replace(/\\/g, '/');
      arrayOfFiles.push(webPath);
    }
  });
  
  return arrayOfFiles;
}

/**
 * Generate assets list for sitemap
 */
function generateAssetsList() {
  const publicDir = path.join(process.cwd(), 'public');
  const allFiles = getAllFiles(publicDir);
  
  // Filter for web assets
  const webAssets = allFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return [
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', // Images
      '.mp4', '.mov', '.avi', '.webm', // Videos
      '.pdf', '.doc', '.docx', // Documents
      '.css', '.js', '.json', // Web assets
    ].includes(ext);
  });
  
  return webAssets;
}

/**
 * Fetch products from Shopify using the storefront API
 */
async function getProductHandles() {
  try {
    const domain = process.env.SHOPIFY_STORE_DOMAIN || 'kilaeko-application.myshopify.com';
    const endpoint = `https://${domain}/api/2025-01/graphql.json`;
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!accessToken) {
      console.warn('SHOPIFY_STOREFRONT_ACCESS_TOKEN not found. Skipping product fetching.');
      return [];
    }

    const query = `
      query getProducts($first: Int!) {
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              handle
              updatedAt
              availableForSale
            }
          }
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query,
        variables: { first: 250 } // Fetch up to 250 products
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }

    return data.data.products.edges.map(edge => ({
      handle: edge.node.handle,
      updatedAt: edge.node.updatedAt,
      availableForSale: edge.node.availableForSale
    }));

  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    return [];
  }
}

/**
 * Fetch collections from Shopify
 */
async function getCollectionHandles() {
  try {
    const domain = process.env.SHOPIFY_STORE_DOMAIN || 'kilaeko-application.myshopify.com';
    const endpoint = `https://${domain}/api/2025-01/graphql.json`;
    const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!accessToken) {
      console.warn('SHOPIFY_STOREFRONT_ACCESS_TOKEN not found. Skipping collection fetching.');
      return [];
    }

    const query = `
      query getCollections($first: Int!) {
        collections(first: $first, sortKey: TITLE) {
          edges {
            node {
              handle
              updatedAt
            }
          }
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query,
        variables: { first: 50 } // Fetch up to 50 collections
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      return [];
    }

    return data.data.collections.edges.map(edge => ({
      handle: edge.node.handle,
      updatedAt: edge.node.updatedAt
    })).filter(collection => collection.handle !== 'all'); // Exclude the "all" collection

  } catch (error) {
    console.error('Error fetching collections from Shopify:', error);
    return [];
  }
}

/**
 * Generate dynamic routes for sitemap
 */
async function getDynamicRoutes() {
  const [products, collections] = await Promise.all([
    getProductHandles(),
    getCollectionHandles()
  ]);
  
  const routes = [];
  const currentDate = new Date().toISOString();
  
  // Product pages
  products.forEach(product => {
    routes.push({
      loc: `/catalog/${product.handle}`,
      lastmod: product.updatedAt || currentDate,
      changefreq: 'weekly',
      priority: 0.8,
    });
  });
  
  // Collection pages
  collections.forEach(collection => {
    routes.push({
      loc: `/collections/${collection.handle}`,
      lastmod: collection.updatedAt || currentDate,
      changefreq: 'monthly',
      priority: 0.7,
    });
  });
  
  return routes;
}

/**
 * Generate static routes (pages that always exist)
 */
function getStaticRoutes() {
  const currentDate = new Date().toISOString();
  
  return [
    {
      loc: '/',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: '/catalog',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: '/about',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: '/contact',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.6,
    },
    {
      loc: '/sustainability',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5,
    },
    {
      loc: '/size-guide',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5,
    },
    {
      loc: '/returns',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5,
    },
    {
      loc: '/faq',
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.5,
    },
    {
      loc: '/privacy',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3,
    },
    {
      loc: '/tos',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3,
    },
    {
      loc: '/accessibility',
      lastmod: currentDate,
      changefreq: 'yearly',
      priority: 0.3,
    },
    {
      loc: '/collection-journal',
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.6,
    },
    {
      loc: '/search',
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.7,
    },
  ];
}

/**
 * Main function to get all routes for sitemap
 */
async function getAllRoutes() {
  const [staticRoutes, dynamicRoutes] = await Promise.all([
    getStaticRoutes(),
    getDynamicRoutes()
  ]);
  
  return [...staticRoutes, ...dynamicRoutes];
}

// Export for use in next-sitemap.config.js
module.exports = {
  generateAssetsList,
  getAllFiles,
  getProductHandles,
  getCollectionHandles,
  getDynamicRoutes,
  getStaticRoutes,
  getAllRoutes
};