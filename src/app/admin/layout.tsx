import AdminNav from "@/components/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-linear-to-br from-slate-50 via-white to-indigo-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Vendora Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard</p>
        </div>

        <AdminNav />
      </aside>

      <main className="flex-1 overflow-x-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
