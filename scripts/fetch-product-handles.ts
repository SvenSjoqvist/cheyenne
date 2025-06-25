import fs from 'fs';
import path from 'path';
import { getProducts } from '../src/app/lib/shopify';

async function main() {
  const products = await getProducts({ query: "" });
  const handles = products.map((product) => product.handle);
  fs.writeFileSync(
    path.join(__dirname, 'product-handles.json'),
    JSON.stringify(handles, null, 2)
  );
  console.log(`Fetched ${handles.length} product handles.`);
}

main().catch((err) => {
  console.error('Error fetching product handles:', err);
  process.exit(1);
}); 