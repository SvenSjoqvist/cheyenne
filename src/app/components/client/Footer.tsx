import Link from "next/link";
import Image from "next/image";
import { NewsLetter } from "./footer/newsLetter";
type FooterProps = {
  sections?: FooterSection[]; // Made optional since we have default sections
  paymentMethods: string[];
};

type FooterSection = {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

export const Footer = ({ sections }: FooterProps) => {
  return (
    <footer className="flex flex-col items-center pt-8 w-full border-t bg-neutral-100 border-zinc-200">
      <div className="flex flex-wrap gap-1.5 items-start w-full px-8">
        {sections!.map((section, index) => (
          <section
            key={index}
            className="flex flex-col items-start leading-0.5 text-neutral-800 flex-1 min-w-[200px]"
          >
            <h3 className="text-xl font-bold tracking-wider font-[bero]">
              {section.title}
            </h3>
            <hr className="shrink-0 self-stretch mt-4 mr-10 h-px border-0.5 border-solid bg-neutral-800 border-neutral-800" />
            <nav className="flex flex-col mt-4 text-base font-medium tracking-wider">
              {section.links.map((link, linkIndex) => (
                <Link
                  href={link.href}
                  key={linkIndex}
                  className={`${
                    linkIndex > 0 ? "mt-4" : ""
                  } font-darker-grotesque hover:text-neutral-600 transition-colors`}
                  target={link.href.startsWith("http") ? "_blank" : "_self"}
                  rel={
                    link.href.startsWith("http") ? "noopener noreferrer" : ""
                  }
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </section>
        ))}

        <section className="flex flex-col flex-1 min-w-[200px]">
          <h3 className="text-xl font-bold tracking-wider font-[bero]">
          newsletter sign up
          </h3>
         <NewsLetter /> 
        </section>
      </div>
      <div className="w-full px-10 mt-12">
        <hr className="w-full h-px border-0.5 border-solid bg-neutral-800 border-neutral-800" />
      </div>

      <div className="flex flex-wrap gap-5 justify-between items-center self-stretch px-8 py-6 w-full font-medium leading-none bg-neutral-100 max-md:px-5">
        <Link
          href="/currency-selection"
          className="self-stretch my-auto text-base tracking-wider text-stone-500 hover:text-stone-700 transition-colors"
        >
          currency - select
        </Link>
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image src="/logoFooter.svg" width={35} height={35} alt="Logo" />
        </Link>
        <p className="flex gap-1.5 self-stretch my-auto text-xs tracking-wide text-neutral-800">
          <span>&copy; Kilaeko 2025</span>
        </p>
      </div>
    </footer>
  );
};
