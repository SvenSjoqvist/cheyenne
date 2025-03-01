import Link from 'next/link';
import React, { Suspense } from 'react'; // Import Suspense
import Image from 'next/image';
import SearchBar from './Search'; // Import SearchBar
import { getMenu } from '../lib/shopify';
import CartModal from './cart/modal';

const Navigation = async () => {
  const navItems = await getMenu('main-menu');

  return (
    <div className="p-8 w-full border-b bg-neutral-100 border-zinc-300 max-md:px-5">
      <div className="flex flex-col items-center w-full max-md:flex-col">
        <div className="flex justify-between items-center w-full max-md:flex-col max-md:gap-4">
          {/* Navigation Links */}
          <div className="flex gap-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={`/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="hover:underline text-base font-darker-grotesque tracking-wider leading-none text-black"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link href={'/'}>
            <Image
              loading="lazy"
              src={'/logo.svg'}
              width={100}
              height={100}
              alt="Company logo"
              className="object-contain w-[190px] max-md:w-[150px]"
            />
          </Link>

          {/* SearchBar with Suspense */}
          <div className="flex gap-8 items-center">
          <Suspense fallback={<div>Loading search...</div>}>
              <SearchBar />
            </Suspense>
            <Image src="/icons/human.svg" alt="Cart" width={23} height={23} />
            <Image src="/icons/money.svg" alt="Cart" width={23} height={23} />
          <CartModal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;