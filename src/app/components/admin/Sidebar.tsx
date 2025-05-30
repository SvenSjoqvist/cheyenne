"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const sidebarItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Products", href: "/dashboard/products" },
  { label: "Orders", href: "/dashboard/orders" },
  { label: "Customers", href: "/dashboard/customers" },
  { label: "Marketing", href: "/dashboard/marketing" },
  { label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-64 bg-white h-full shadow-lg">
      <div className="p-4">
        <Image src="/logo.svg" alt="Kilaeko" width={200} height={200} />
      </div>
      <nav className="mt-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 text-sm ${
              pathname === item.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
} 