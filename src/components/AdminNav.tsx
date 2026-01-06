"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/products", label: "Products" },
    { href: "/admin/products/add", label: "Add Product" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/orders/add", label: "Add Order" },
  ];

  const { data: session } = useSession();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="flex flex-col gap-1 px-4 py-4">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              active
                ? "bg-purple-100 text-purple-700 border-l-4 border-purple-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      {session?.user?.role === "admin" && (
        <Link
          href="/admin/onboard"
          className={`block w-full mt-3 px-4 py-3 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-100`}
        >
          Onboard Admin
        </Link>
      )}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200 text-left"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

