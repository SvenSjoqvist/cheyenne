import HeroSection from '@/app/components/client/main/Hero';
import ProductSection from '@/app/components/client/main/Products';
import ImageOverlay from '@/app/components/client/main/Overlay';
import RunawaySection from '@/app/components/client/main/About';
import { Product } from '@/app/lib/shopify/types';
import Link from 'next/link';
import { getProducts } from '@/app/lib/shopify';

const KilaekoPage: React.FC = async () => {
  try {
    const products = await getProducts({ query: "" });
  
  const productPairs = new Map<string, { main: Product; related: Product[] }>();
  
  const getBaseName = (title: string | undefined) => {
    if (!title) return '';
    return title.replace(/\s+(Top|Bottom|One Piece)$/, '');
  };

  // Group products by their base name
    products.forEach((product) => {
    if (!product?.title) return; // Skip products without titles
    
    const baseName = getBaseName(product.title);
    if (!baseName) return; // Skip if base name is empty
    
    if (!productPairs.has(baseName)) {
      productPairs.set(baseName, { main: product, related: [] });
    }
    
    const pair = productPairs.get(baseName)!;
    
    // If it's a one piece, make it the main product
    if (product.title.includes('One Piece')) {
      pair.main = product;
    }
    // If it's a top, make it the main product
    else if (product.title.includes('Top')) {
      pair.main = product;
    }
    // If it's a bottom, add it to related
    else if (product.title.includes('Bottom')) {
      pair.related.push(product);
    }
  });

  // Convert map to array and take first 4 unique products
  const productGroups = Array.from(productPairs.values())
    .filter(group => group.main && group.main.title) // Ensure we only have valid products
    .slice(0, 4); // Take only 4 products

  return (
    <div className="flex overflow-hidden flex-col bg-neutral-100">
      <div className="relative">
        <HeroSection />
        <div className="relative w-full">
          <ImageOverlay
            backgroundSrc="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/f69a4747478375673d3bf50b5295aac6cd7566809f6d599e8786c19a699a02a9?apiKey=df24f938eeb948889fe9ad55656873a2&"
            overlaySrc="/home.png"
          />
        </div>
      </div>
      {productGroups.length > 0 && <ProductSection productGroups={productGroups}/>}
      <Link className="cursor-pointer self-center px-5 py-2 mt-32 max-w-full text-2xl font-darker-grotesque tracking-wider leading-none bg-neutral-800 text-neutral-100 w-auto max-md:mt-10 inline-flex items-center justify-center" href={"/catalog"}>
        shop now
      </Link>

      <RunawaySection />
      <div className="text-center px-16 py-24 w-full text-4xl font-bold leading-none bg-[#588FAE] text-neutral-100 tracking-[2px] max-md:px-5 max-md:max-w-full font-[bero]">
        no restocks, limited quantity.
      </div>
    </div>
  );
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return a fallback UI if products can't be loaded
    return (
      <div className="flex overflow-hidden flex-col bg-neutral-100">
        <div className="relative">
          <HeroSection />
          <div className="relative w-full">
            <ImageOverlay
              backgroundSrc="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/f69a4747478375673d3bf50b5295aac6cd7566809f6d599e8786c19a699a02a9?apiKey=df24f938eeb948889fe9ad55656873a2&"
              overlaySrc="/home.png"
            />
          </div>
        </div>
        <div className="text-center py-10">
          <p className="text-lg">Loading products...</p>
        </div>
        <RunawaySection />
        <div className="text-center px-16 py-24 w-full text-4xl font-bold leading-none bg-[#588FAE] text-neutral-100 tracking-[2px] max-md:px-5 max-md:max-w-full font-[bero]">
          no restocks, limited quantity.
        </div>
      </div>
    );
  }
};

export default KilaekoPage;