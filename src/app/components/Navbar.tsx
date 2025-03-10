import Link from "next/link";
import React, { Suspense } from "react";
import Image from "next/image";
import SearchBar from "./Search";
import { getMenu } from "../lib/shopify";
import CartModal from "./cart/modal";
import OpenForm from "./account/open-form";

const Navigation = async () => {
  const navItems = await getMenu("main-menu");

  return (
    <nav className="p-8 w-full border-b bg-neutral-100 border-zinc-300 max-md:px-5">
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-between items-center w-full max-md:flex-col max-md:gap-4">
          {/* Navigation Links  */}
          <div className="flex gap-4 md:gap-8 flex-nowrap">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={`/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                className="hover:underline text-base font-darker-grotesque tracking-wider leading-none overflow-y-hidden text-black flex-shrink-0 py-1"
              >
                {item.title}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link href={"/"} className="my-2">
            <Image
              loading="lazy"
              src={"/logo.svg"}
              width={100}
              height={100}
              alt="Company logo"
              className="object-contain w-[190px] max-md:w-[150px]"
            />
          </Link>

          {/* SearchBar with Suspense */}
          <div className="flex gap-4 md:gap-8 items-center overflow-x-auto overflow-y-hidden flex-nowrap">
            <Suspense fallback={<div>Loading search...</div>}>
              <SearchBar />
            </Suspense>
            <OpenForm />
            <Image
              src="/icons/money.svg"
              alt="Cart"
              width={23}
              height={23}
              className="cursor-pointer flex-shrink-0"
            />
            <CartModal />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
