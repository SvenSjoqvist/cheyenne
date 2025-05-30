import { Darker_Grotesque } from "next/font/google";
import "@/app/globals.css";
import Sidebar from "@/app/components/admin/Sidebar";

const darkerGrotesque = Darker_Grotesque({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800", "900"], 
    variable: "--font-darker-grotesque", 
  });

export default async function RootLayout({
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
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </body>
      </html>
    );
  }