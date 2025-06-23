import Header from "@/app/components/client/Header";
import Navbar from "@/app/components/client/navbar/Navbar";
import { Footer } from "@/app/components/client/Footer";
import { CartProvider } from "@/app/components/client/cart/cart-context";
import { cookies } from "next/headers";
import { getCart } from "@/app/lib/shopify";
import SizeGuide from "@/app/components/client/SizeGuide";
import CartModal from "../components/client/cart/modal";

type FooterSection = {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

// Updated footer sections with proper links
const footerSections: FooterSection[] = [
  {
    title: "concierge",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Size & fit", href: "/size-guide" },
      { label: "Track an order", href: "/order-tracking" },
      { label: "Shipping & delivery", href: "/shipping" },
      { label: "Account", href: "/account" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "company",
    links: [
      { label: "Who we are", href: "/about" },
      { label: "Sustainability", href: "/sustainability" },
    ],
  },
  {
    title: "legal",
    links: [
      { label: "Return & cancellation policy", href: "/returns" },
      { label: "Accessibility policy", href: "/accessibility" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/tos" },
      {
        label: "do not sell or share my personal data​",
        href: "/privacy/do-not-sell",
      },
    ],
  },
  {
    title: "socials",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/kilaekoswim/" },
      { label: "Spotify", href: "https://open.spotify.com/user/31htb6nn2p2wywhn4gofxjrlt6we?si=8f1b1c1d215147de" },
      { label: "Pinterest", href: "https://www.pinterest.com/015bqs6mcp6ta4frqsyu71hx8g9xpv/" },
      { label: "TikTok", href: "https://www.instagram.com/kilaekoswim/" },
      { label: "Substack", href: "https://substack.com/@kilaeko" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/kilaeko/" },
    ],
  },
];

const paymentMethods = [
  "/payment/visa.svg",
  "/payment/mastercard.svg",
  "/payment/paypal.svg",
  "/payment/klarna.svg",
  "/payment/applepay.svg",
  "/payment/afterpay.svg",
  "/payment/shoppay.svg",
  "/payment/googlepay.svg",
  "/payment/amex.svg",
];

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = (await cookies()).get("cartId")?.value;
  const cart = getCart(cartId);

  return (
    <div className="bg-[#F5F5F5]">
    <CartProvider cartPromise={cart}>
      <Header />
      <Navbar />
      <CartModal />
      {children}
      <Footer sections={footerSections} paymentMethods={paymentMethods} />
      <SizeGuide />
    </CartProvider>
    </div>
  );
}

