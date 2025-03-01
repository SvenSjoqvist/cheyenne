import HeroSection from './_components/Hero';
import ProductSection from './_components/Products';
import ImageOverlay from './_components/Overlay';
import RunawaySection from './_components/About';
import { getProducts } from '@/app/lib/shopify';
import Link from 'next/link';

const KilaekoPage: React.FC = async () => {

  const heroSectionProps = {
    backgroundImage: "https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/63f22b473e11fee9c7f5ef8299ad98ab6bd5095e858350ca520d45d76223ce8d?apiKey=df24f938eeb948889fe9ad55656873a2&",
  };
  const products = await getProducts({ query: "" });
  const productsSlice = products.slice(0, 4);


  return (
    <div className="flex overflow-hidden flex-col bg-neutral-100">
      <HeroSection {...heroSectionProps} />
      <div className="flex relative flex-col justify-center items-center w-full min-h-[1024px] max-md:px-5 max-md:max-w-full">
      <ImageOverlay
      backgroundSrc="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/f69a4747478375673d3bf50b5295aac6cd7566809f6d599e8786c19a699a02a9?apiKey=df24f938eeb948889fe9ad55656873a2&"
      overlaySrc="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/e9cafacfea9c8e1bb665842f9aedd625182e915211ca51f507a85f8b1e717158?apiKey=df24f938eeb948889fe9ad55656873a2&"
    />
      </div>
      <ProductSection products={productsSlice}/>
      <Link className="cursor-pointer self-center px-5 py-2 mt-32 max-w-full text-2xl font-darker-grotesque tracking-wider leading-none bg-neutral-800 text-neutral-100 w-auto max-md:mt-10 inline-flex items-center justify-center" href={"/catalog"}>
  shop now
</Link>


<RunawaySection />
<div className=" text-center px-16 py-24 w-full text-4xl font-bold leading-none bg-[#588FAE] text-neutral-100 tracking-[2px] max-md:px-5 max-md:max-w-full font-[bero]">
        no restocks, limited quantity.
      </div>
    </div>
  );
};

export default KilaekoPage;