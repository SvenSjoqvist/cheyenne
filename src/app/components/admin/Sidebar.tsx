"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

interface SubItem {
  label: string;
  href: string;
}

interface SidebarItem {
  label: string;
  href: string;
  subItems?: SubItem[];
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

interface SidebarItems {
  [key: string]: SidebarSection;
}

const sidebarItems: SidebarItems = {
  operations: {
    label: "Operations",
    items: [
      { label: "Inventory", href: "/dashboard/inventory" },
      { label: "Orders", href: "/dashboard/orders" },
      { label: "Customers", href: "/dashboard/customers" },
      {
        label: "Team",
        href: "/dashboard/team",
      },
    ],
  },
  performance: {
    label: "Performance",
    items: [
      { label: "Marketing", href: "/dashboard/marketing" },
      { label: "Sales", href: "/dashboard/sales" },
    ],
  },
  support: {
    label: "Support",
    items: [
      { label: "Cancellations", href: "/dashboard/cancellations" },
      {
        label: "Returns",
        href: "/dashboard/returns",
      },
    ],
  },
};

export default function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    operations: true,
    performance: true,
    support: true,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getSvgHeight = (section: string) => {
    if (section === "performance" || section === "support") {
      return "32";
    }
    return "83";
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md shadow-md"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMobileMenuOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed
          top-0 left-0
          h-screen
          bg-white
          border-r-2 border-[#DADEE0]
          transition-transform duration-300 ease-in-out
          z-40
          ${
            isMobile
              ? isMobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
          ${isMobile ? "w-full" : "w-[200px]"}
          shadow-lg md:shadow-none
        `}
      >
        <div className="p-4 flex justify-center mt-11">
          <Link href="/dashboard">
            <Image src="/logoFooter.svg" alt="Kilaeko" width={64} height={64} />
          </Link>
        </div>
        <nav className="mt-32 overflow-y-auto h-[calc(100vh-200px)]">
          {Object.entries(sidebarItems).map(([key, section]) => (
            <div key={key} className="mb-2">
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-4 py-2 text-left text-[20px] font-darker-grotesque font-medium text-[#212121] hover:opacity-80 flex justify-between items-center tracking-wider"
              >
                {section.label}
                <svg
                  width="10"
                  height="5"
                  viewBox="0 0 10 5"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`transform transition-transform duration-200 ${
                    openSections[key] ? "rotate-180" : ""
                  }`}
                >
                  <path d="M1 4L5 1L9 4" stroke="#212121" />
                </svg>
              </button>
              {openSections[key] && (
                <div className="pl-4 relative ml-3">
                  <svg
                    width="8"
                    height={getSvgHeight(key)}
                    viewBox={`0 0 8 ${getSvgHeight(key)}`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-2 top-2"
                  >
                    <line
                      x1="0.5"
                      y1="1.53422e-05"
                      x2="0.497484"
                      y2={getSvgHeight(key)}
                      stroke="#212121"
                    />
                    {key === "performance" || key === "support" ? (
                      <>
                        <path
                          d="M7.00391 32C7.28005 32 7.50391 31.7761 7.50391 31.5C7.50391 31.2239 7.28005 31 7.00391 31V32ZM1.00391 31.5V32H7.00391V31.5V31H1.00391V31.5Z"
                          fill="#212121"
                        />
                        <path
                          d="M7.00391 7.5C7.28005 7.5 7.50391 7.27614 7.50391 7C7.50391 6.72386 7.28005 6.5 7.00391 6.5V7.5ZM1.00391 7V7.5H7.00391V7V6.5H1.00391V7Z"
                          fill="#212121"
                        />
                      </>
                    ) : (
                      <>
                        <path
                          d="M7 32C7.27614 32 7.5 31.7761 7.5 31.5C7.5 31.2239 7.27614 31 7 31V32ZM1 31.5V32H7V31.5V31H1V31.5Z"
                          fill="#212121"
                        />
                        <path
                          d="M7 57.5C7.27614 57.5 7.5 57.2761 7.5 57C7.5 56.7239 7.27614 56.5 7 56.5V57.5ZM1 57V57.5H7V57V56.5H1V57Z"
                          fill="#212121"
                        />
                        <path
                          d="M7 82.5C7.27614 82.5 7.5 82.2761 7.5 82C7.5 81.7239 7.27614 81.5 7 81.5V82.5ZM0 82V82.5H7V82V81.5H0V82Z"
                          fill="#212121"
                        />
                        <path
                          d="M7 7.5C7.27614 7.5 7.5 7.27614 7.5 7C7.5 6.72386 7.27614 6.5 7 6.5V7.5ZM1 7V7.5H7V7V6.5H1V7Z"
                          fill="#212121"
                        />
                      </>
                    )}
                  </svg>
                  {section.items.map((item) => (
                    <div key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => isMobile && setIsMobileMenuOpen(false)}
                        className={`block px-1 text-[15px] font-darker-grotesque font-regular hover:opacity-80 tracking-wider leading-6.5 ${
                          pathname.startsWith(item.href)
                            ? "underline underline-offset-2 decoration-1"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                      {item.subItems && (
                        <div className="pl-4 relative">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              onClick={() =>
                                isMobile && setIsMobileMenuOpen(false)
                              }
                              className={`block text-[15px] font-darker-grotesque font-regular hover:opacity-80 tracking-wider leading-6.5 ${
                                pathname.startsWith(subItem.href)
                                  ? "underline"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
