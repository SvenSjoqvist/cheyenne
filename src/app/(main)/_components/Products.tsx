import React from 'react';

interface Product {
  name: string;
  topPrice: string;
  bottomPrice: string;
}

interface ProductSectionProps {
  products: Product[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ products }) => {
  return (
    <section className="self-center mt-32 w-full max-w-[1376px] max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 max-md:flex-col">
        {products.map((product, index) => (
          <article key={index} className="flex flex-col w-3/12 max-md:ml-0 max-md:w-full">
            <div className="flex flex-col w-full text-xl font-medium tracking-wider leading-none text-neutral-800 max-md:mt-6">
              <figure className="flex shrink-0 bg-gray-200 h-[408px]" />
              
              <h2 className="self-center mt-4 font-darker-grotesque">{product.name}</h2>
              
              <div className="flex gap-10 justify-between items-center mt-4">
                <p className="self-stretch my-auto font-darker-grotesque">top: {product.topPrice}</p>
                <div className="flex flex-col self-stretch my-auto rounded-none w-[89px]">
                <button className="font-darker-grotesque text-xl">add to bag</button>
                <div className="shrink-0 h-px border-solid border-neutral-800 border-[0.5px]" /></div>
              </div>

              <div className="flex gap-10 justify-between items-center mt-4">
                <p className="self-stretch my-auto font-darker-grotesque">bottom: {product.bottomPrice}</p>
                <div className="flex flex-col self-stretch my-auto rounded-none w-[89px]">
                  <button className="font-darker-grotesque text-xl">add to bag</button>
                  <div className="shrink-0 h-px border-solid border-neutral-800 border-[0.5px]" /> </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
