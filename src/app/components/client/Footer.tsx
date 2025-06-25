import Link from "next/link";
import Image from "next/image";
import { NewsLetter } from "./footer/newsLetter";

type FooterSection = {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

// Footer sections with proper links
const footerSections: FooterSection[] = [
  {
    title: "Concierge",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Size & Fit", href: "/size-guide" },
      /*{ label: "Track an Order", href: "/order-tracking" },*/
      /*{ label: "Shipping & Delivery", href: "/shipping" },*/
      { label: "Account", href: "/account" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Who We Are", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Return & Cancellation Policy", href: "/returns" },
      { label: "Accessibility Policy", href: "/accessibility" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/tos" },
    ],
  },
  {
    title: "Socials",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/kilaekoswim/" },
      {
        label: "Spotify",
        href: "https://open.spotify.com/user/31htb6nn2p2wywhn4gofxjrlt6we?si=8f1b1c1d215147de",
      },
      {
        label: "Pinterest",
        href: "https://www.pinterest.com/015bqs6mcp6ta4frqsyu71hx8g9xpv/",
      },
      { label: "TikTok", href: "https://www.instagram.com/kilaekoswim/" },
      { label: "Substack", href: "https://substack.com/@kilaeko" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/kilaeko/" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="flex flex-col items-center pt-8 w-full border-t bg-neutral-100 border-zinc-200">
      <div className="flex flex-wrap gap-1.5 items-start w-full px-8">
        {footerSections.map((section, index) => (
          <section
            key={index}
            className="flex flex-col items-start leading-0.5 text-neutral-800 flex-1 min-w-[200px]"
          >
            <h3 className="text-xl font-bold tracking-wider font-[bero]">
              {section.title}
            </h3>
            <hr className="shrink-0 self-stretch mr-10 h-px border-0.5 border-solid bg-neutral-800 border-neutral-800" />
            <nav className="flex flex-col mt-2 text-left font-medium tracking-wider font-darker-grotesque leading-4">
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
