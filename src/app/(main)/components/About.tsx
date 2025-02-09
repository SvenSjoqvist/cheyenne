"use client"

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const RunawaySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState('auto');

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        setContainerHeight(`${height}px`);
      }
    };

    // Initial height calculation
    updateHeight();

    // Add resize listener
    window.addEventListener('resize', updateHeight);
    
    // Cleanup
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <section className="mt-32 w-full max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-0 max-md:flex-col">
        {/* Left Content */}
        <div 
          className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full"
          style={{ height: containerHeight }}
        >
          <div className="flex flex-col items-start h-full py-56 pr-20 pl-9 bg-[#212121] text-neutral-100 max-md:px-5 max-md:py-24 max-md:max-w-full">
            <h2 className="text-4xl leading-8 tracking-[2px] max-md:max-w-full">
              <span className="font-bold font-[bero] text-[40px]">an insider look behind </span>
              <br />
              <span className="font-bold text-neutral-300 font-[bero] text-[40px]">the runaway collection</span>
            </h2>
            
            <p className="mt-9 text-2xl max-md:max-w-full font-darker-grotesque">
              Runaway Collection is a story about the journey to self discovery and life-altering decisions. 
              The inspiration behind Runaway comes from the breath-taking views of coastal California.
              <br /><br />
              turpis magna ac cum mattis tellus suscipit sodales mollis molestie. sodales gravida in 
              pharetra nisl lacus convallis risus molestie. cursus sapien scelerisque elementum eget 
              pharetra ipsum scelerisque ante odio. est erat mi aenean imperdiet volutpat.
            </p>
            
            <button className="flex items-center gap-6 mt-24 text-xl text-neutral-100 max-md:mt-10">
              <span>read more</span>
              <Image
                src="/money.svg"
                alt="Read more arrow"
                width={14}
                height={9}
                className="object-contain w-3.5 aspect-[1.56]"
              />
            </button>
          </div>
        </div>

        {/* Right Side - Background Image */}
        <div className="w-6/12 max-md:w-full relative" ref={containerRef}>
          <div className="relative w-full">
            <Image
              src="https://cdn.builder.io/api/v1/image/assets/df24f938eeb948889fe9ad55656873a2/8ea0f181d622321167dcc13dadf075228ff5f14837c9d018d117a9be1c02d5ac?apiKey=df24f938eeb948889fe9ad55656873a2&"
              alt="Runaway Collection background"
              width={1000}
              height={1500}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {/* Overlapping Cute Girl Image */}
          <div className="absolute top-9 left-11 z-10 w-[300px] h-[400px]">
            <Image
              src="/cutegirl.png"
              alt="Cute girl"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RunawaySection;