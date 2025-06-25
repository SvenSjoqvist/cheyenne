const fs = require('fs');
const path = require('path');

/**
 * Generate comprehensive SEO data for the entire site
 * This script fetches all products and collections from Shopify
 * and generates SEO data for each route
 */
async function generateSEOData() {
  console.log('🚀 Starting SEO data generation...');

  try {
    // Import our SEO generator functions from CommonJS version
    const { generateAllRouteSEO, generateSitemapWithSEO } = require('./seo-generator-cjs.js');
    
    console.log('📊 Generating SEO data for all routes...');
    const { routes, sitemap } = await generateSitemapWithSEO();
    
    // Create output directory
    const outputDir = path.join(process.cwd(), 'public', 'seo');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate individual route SEO data
    const routeSEOData = {};
    for (const route of routes) {
      routeSEOData[route.path] = {
        seo: route.seo,
        lastmod: route.lastmod,
        changefreq: route.changefreq,
        priority: route.priority
      };
    }

    // Write route SEO data
    const routeSEOFile = path.join(outputDir, 'routes-seo.json');
    fs.writeFileSync(routeSEOFile, JSON.stringify(routeSEOData, null, 2));
    console.log(`✅ Route SEO data written to: ${routeSEOFile}`);

    // Write sitemap data
    const sitemapFile = path.join(outputDir, 'sitemap-data.json');
    fs.writeFileSync(sitemapFile, JSON.stringify(sitemap, null, 2));
    console.log(`✅ Sitemap data written to: ${sitemapFile}`);

    // Generate a summary report
    const summary = {
      generatedAt: new Date().toISOString(),
      totalRoutes: routes.length,
      staticRoutes: routes.filter(r => !r.path.includes('[')).length,
      dynamicRoutes: routes.filter(r => r.path.includes('[')).length,
      productRoutes: routes.filter(r => r.path.startsWith('/catalog/')).length,
      collectionRoutes: routes.filter(r => r.path.startsWith('/collections/')).length,
      excludedRoutes: 0, // This would be calculated based on your exclusion logic
      routesByPriority: {
        '1.0': routes.filter(r => r.priority === 1.0).length,
        '0.9': routes.filter(r => r.priority === 0.9).length,
        '0.8': routes.filter(r => r.priority === 0.8).length,
        '0.7': routes.filter(r => r.priority === 0.7).length,
        '0.6': routes.filter(r => r.priority === 0.6).length,
        '0.5': routes.filter(r => r.priority === 0.5).length,
        '0.3': routes.filter(r => r.priority === 0.3).length,
      }
    };

    const summaryFile = path.join(outputDir, 'seo-summary.json');
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`✅ SEO summary written to: ${summaryFile}`);

    // Generate a human-readable report
    const report = generateHumanReadableReport(summary, routes);
    const reportFile = path.join(outputDir, 'seo-report.txt');
    fs.writeFileSync(reportFile, report);
    console.log(`✅ Human-readable report written to: ${reportFile}`);

    console.log('\n🎉 SEO data generation completed successfully!');
    console.log(`📁 All files saved to: ${outputDir}`);
    console.log(`📊 Total routes processed: ${routes.length}`);
    console.log(`🛍️  Product routes: ${summary.productRoutes}`);
    console.log(`📚 Collection routes: ${summary.collectionRoutes}`);

  } catch (error) {
    console.error('❌ Error generating SEO data:', error);
    process.exit(1);
  }
}

/**
 * Generate a human-readable report
 */
function generateHumanReadableReport(summary, routes) {
  let report = `SEO Data Generation Report
Generated: ${summary.generatedAt}
=====================================

SUMMARY:
- Total Routes: ${summary.totalRoutes}
- Static Routes: ${summary.staticRoutes}
- Dynamic Routes: ${summary.dynamicRoutes}
- Product Routes: ${summary.productRoutes}
- Collection Routes: ${summary.collectionRoutes}

PRIORITY BREAKDOWN:
- Priority 1.0 (Homepage): ${summary.routesByPriority['1.0']}
- Priority 0.9 (Catalog): ${summary.routesByPriority['0.9']}
- Priority 0.8 (Products): ${summary.routesByPriority['0.8']}
- Priority 0.7 (Collections): ${summary.routesByPriority['0.7']}
- Priority 0.6 (Main pages): ${summary.routesByPriority['0.6']}
- Priority 0.5 (Info pages): ${summary.routesByPriority['0.5']}
- Priority 0.3 (Legal pages): ${summary.routesByPriority['0.3']}

ROUTES BY CATEGORY:
==================

STATIC ROUTES:
${routes.filter(r => !r.path.includes('[')).map(r => `- ${r.path} (Priority: ${r.priority}, Change: ${r.changefreq})`).join('\n')}

PRODUCT ROUTES (First 10):
${routes.filter(r => r.path.startsWith('/catalog/')).slice(0, 10).map(r => `- ${r.path} (Priority: ${r.priority}, Change: ${r.changefreq})`).join('\n')}

COLLECTION ROUTES:
${routes.filter(r => r.path.startsWith('/collections/')).map(r => `- ${r.path} (Priority: ${r.priority}, Change: ${r.changefreq})`).join('\n')}

EXCLUDED ROUTES:
- /dashboard/*
- /account/*
- /admin/*
- /api/*
- /_next/*
- /404
- /500

NOTES:
- All product routes include structured data for rich snippets
- Open Graph and Twitter Card metadata included for social sharing
- Canonical URLs set for all routes to prevent duplicate content
- Robots meta tags configured for proper indexing
- Keywords generated from product data and tags
`;

  return report;
}

/**
 * Generate SEO data for a specific route (for testing)
 */
async function generateRouteSEO(routePath) {
  try {
    const { getSEODataForRoute } = require('./seo-generator-cjs.js');
    const seoData = await getSEODataForRoute(routePath);
    
    if (seoData) {
      console.log(`\n📄 SEO Data for ${routePath}:`);
      console.log(JSON.stringify(seoData, null, 2));
    } else {
      console.log(`\n❌ No SEO data found for ${routePath}`);
    }
  } catch (error) {
    console.error(`❌ Error generating SEO for ${routePath}:`, error);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Generate all SEO data
    generateSEOData();
  } else if (args[0] === '--route' && args[1]) {
    // Generate SEO for a specific route
    generateRouteSEO(args[1]);
  } else {
    console.log('Usage:');
    console.log('  node scripts/generate-seo-data.js                    # Generate all SEO data');
    console.log('  node scripts/generate-seo-data.js --route /catalog   # Generate SEO for specific route');
  }
}

module.exports = {
  generateSEOData,
  generateRouteSEO
}; 