import Link from "next/link";
import Image  from "next/image";
type FooterProps = {
  sections?: FooterSection[]; // Made optional since we have default sections
  paymentMethods: string[];
}
  
type FooterSection = {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}

export const Footer = ({ sections, paymentMethods }: FooterProps) => {
  return (
    <footer className="flex flex-col items-center pt-8 w-full border-t bg-neutral-100 border-zinc-200">
      <div className="flex flex-wrap gap-1.5 items-start w-full px-8">
        {sections!.map((section, index) => (
          <section key={index} className="flex flex-col items-start leading-0.5 text-neutral-800 flex-1 min-w-[200px]">
            <h3 className="text-xl font-bold tracking-wider font-[bero]">{section.title}</h3>
            <hr className="shrink-0 self-stretch mt-3 h-px border-0.5 border-solid bg-neutral-800 border-neutral-800" />
            <nav className="flex flex-col mt-3 text-base font-medium tracking-wider">
              {section.links.map((link, linkIndex) => (
                <Link
                  href={link.href}
                  key={linkIndex}
                  className={`${
                    linkIndex > 0 ? "mt-4" : ""
                  } font-darker-grotesque hover:text-neutral-600 transition-colors`}
                  target={link.href.startsWith('http') ? '_blank' : '_self'} // Open external links in new tab
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </section>
        ))}

        <section className="flex flex-col flex-2.1 min-w-[200px] mt-2">
          <h3 className="self-start text-xl font-bold tracking-wider leading-none text-neutral-800 font-[bero]">
            payments accepted
          </h3>
          <hr className="shrink-0 mt-3 h-px border-0.5 border-solid border-neutral-800" />
          <div className="flex flex-wrap gap-1.5 items-start mt-3 h-[35px]">
            {paymentMethods.map((method, index) => (
              <figure key={index} className="relative w-[50px] aspect-[1.43]">
                <Image
                  fill
                  src={method}
                  alt={`Payment method ${index + 1}`}
                  className="object-contain"
                  sizes="50px"
                />
              </figure>
            ))}
          </div>

          <form className="flex flex-col self-end mt-16 max-w-full font-medium leading-none text-neutral-800 w-full max-md:mt-10">
            <h3 className="text-xl font-bold tracking-wider font-[bero]">
              newsletter sign up
            </h3>
            <p className="mt-2 text-xs tracking-wider leading-4">
              receive early access and behind-the-scenes looks at our latest collections.
            </p>
            <div className="flex items-center mt-2 w-full text-base tracking-wider text-stone-500">
              <input
                type="email"
                id="newsletter-email"
                className="self-stretch px-2 py-2.5 my-auto border border-solid border-neutral-800 min-w-[240px] w-full"
                placeholder="enter email"
              />
              <button 
                type="submit" 
                aria-label="Subscribe to newsletter"
                className="flex items-center justify-center w-[35px] aspect-square hover:opacity-80 transition-opacity"
              >
                <Image 
                  src="/arrowbutton.svg" 
                  width={100} 
                  height={100} 
                  alt='Click here'
                  className="transition-transform hover:translate-x-1"
                />
              </button>
            </div>
          </form>
        </section>
      </div>

      <hr className="shrink-0 mt-10 mx-4 max-w-3xl w-full h-px border-0.5 border-solid bg-neutral-800 border-neutral-800 max-md:mt-10" />
      
      <div className="flex flex-wrap gap-5 justify-between items-center self-stretch px-8 py-6 w-full font-medium leading-none bg-neutral-100 max-md:px-5">
        <Link 
          href="/currency-selection"
          className="self-stretch my-auto text-base tracking-wider text-stone-500 hover:text-stone-700 transition-colors"
        >
          currency - select
        </Link>
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image src="/logoFooter.svg" width={35} height={35} alt='Logo'/>
        </Link>
        <p className="flex gap-1.5 self-stretch my-auto text-xs tracking-wide text-neutral-800">
          <span>&copy; Kilaeko 2025</span>
        </p>
      </div>
    </footer>
  );
};