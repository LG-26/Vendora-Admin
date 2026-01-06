"use client";

import { useState } from "react";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-linear-to-br from-slate-50 via-white to-indigo-50">
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Vendora Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard</p>
        </div>

        <AdminNav />
      </aside>

      <header className="md:hidden w-full bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <span className="sr-only">Open menu</span>
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className="block h-0.5 bg-gray-700" />
              <span className="block h-0.5 bg-gray-700" />
              <span className="block h-0.5 bg-gray-700" />
            </div>
          </button>
          <div>
            <h1 className="text-lg font-semibold">Vendora Admin</h1>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 shadow-sm p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Vendora Admin</h2>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            <AdminNav />
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-x-auto">
        <div className="p-4 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
