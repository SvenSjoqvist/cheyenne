import React from 'react';

interface HeroSectionProps {
  backgroundImage: string;
  buttonText: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ backgroundImage, buttonText }) => {
  return (
    <div className="flex relative flex-col items-end px-20 pb-28 w-full text-lg font-medium tracking-wider leading-5 text-white min-h-[866px] pt-[660px] max-md:py-24 max-md:pl-5 max-md:max-w-full">
      <img
        loading="lazy"
        src={backgroundImage}
        alt="Hero background"
        className="object-cover absolute inset-0 size-full"
      />
      <div className="relative px-4 mb-0 w-24 h-24 rounded-xl bg-neutral-800 rotate-[-0.0021629822690940733rad] max-md:mb-2.5">
        {buttonText}
      </div>
    </div>
  );
};

export default HeroSection;