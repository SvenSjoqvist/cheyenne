import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <>
      <section className="flex flex-col justify-center items-center px-20 py-96 w-full bg-gray-200 max-md:px-5 max-md:py-24 max-md:max-w-full">
        <figure className="relative aspect-square w-[51px] max-md:mb-2.5">
        </figure>
      </section>
      <header className="self-center mt-32 text-4xl font-bold leading-10 text-center text-neutral-800 tracking-[2px] w-[590px] max-md:mt-10 max-md:max-w-full">
        <h1 className="text-4xl font-bold font-[bero]">
          the runaway collection:
          <br />
          <span className="block mt-2">a journey of self-discovery</span>
        </h1>
      </header>
    </>
  );
};

export default HeroSection;