import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

interface NavigationProps {
  navItems: string[];
  socialIcons: string[];
}

const Navigation: React.FC<NavigationProps> = ({ navItems, socialIcons }) => {
  return (
    <div className="p-8 w-full border-b bg-neutral-100 border-zinc-300 max-md:px-5">
      <div className="flex flex-col items-center w-full max-md:flex-col">
        <div className="flex justify-between items-center w-full max-md:flex-col max-md:gap-4">
<div className="flex gap-8">
  {navItems.map((item, index) => (
    <Link key={index} href={`/${item.toLowerCase().replace(/\s+/g, "-")}`} className="hover:underline text-base font-darker-grotesque tracking-wider leading-none text-neutral-800">
      {item}
    </Link>
  ))}
</div>

          <Image
            loading="lazy"
            src={"/logo.svg"}
            width={100}
            height={100}
            alt="Company logo"
            className="object-contain w-[190px] max-md:w-[150px]"
          />
<div className="flex gap-8 items-center">
  {socialIcons.map((icon, index) => (
    <Link href={icon} key={index}>
        <Image
          width={75}
          height={75}
          loading="lazy"
          src={icon}
          alt={`Social media icon ${index + 1}`}
          className="object-contain w-7 aspect-square"
        />
    </Link>
  ))}
</div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;