import type { Metadata } from "next";
import { Darker_Grotesque } from "next/font/google";
import "@/app/globals.css";

const darkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-darker-grotesque",
});

export const metadata: Metadata = {
  title: "Cheyenne",
  description: "Cheyenne e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${darkerGrotesque.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
} 