"use client";

import { useState } from "react";
import Image from "next/image";

export const NewsLetter = () => {
  return (
    <form className="flex flex-col w-full max-w-md mx-auto leading-none text-neutral-800 mt-4">
      <p className="text-sm sm:text-sm tracking-wider leading-5 font-darker-grotesque">
        receive early access and behind-the-scenes looks at our latest
        collections.
      </p>
      <div className="flex items-center mt-4 w-full text-base tracking-wider text-stone-500">
        <input
          type="email"
          name="email"
          className="flex-grow px-3 py-2.5 border border-solid border-neutral-800 focus:outline-none"
          placeholder="enter email"
          required
        />
        <button
          type="submit"
          aria-label="Subscribe to newsletter"
          className="flex items-center justify-center w-[2.83rem] h-[2.83rem] bg-[#212121] transition-colors overflow-hidden"
        >
          <Image
            src="/icons/arrow.svg"
            width={40}
            height={40}
            alt="Subscribe"
            className="transition-transform"
          />
        </button>
      </div>
    </form>
  );
};
