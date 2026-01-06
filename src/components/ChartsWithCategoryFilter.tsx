"use client";

import { useState, useMemo } from "react";
import SalesByProductChart from "@/components/SalesByProductChart";
import StockChart from "@/components/StockChart";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";

export default function ChartsWithCategoryFilter({
  products,
  salesByProduct,
  mode = "both",
}: {
  products: any[];
  salesByProduct: Array<{ id?: string; name: string; sales: number; revenue: number; category?: string }>;
  mode?: "both" | "sales" | "stock";
}) {
  const [category, setCategory] = useState<string>("all");

  const filteredProducts = useMemo(() => {
    if (category === "all") return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  const filteredSales = useMemo(() => {
    if (category === "all") return salesByProduct;
    return salesByProduct.filter((s) => s.category === category);
  }, [salesByProduct, category]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-3 mb-2">
        <label className="text-sm text-gray-600">Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="all">All categories</option>
          {PRODUCT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {mode !== "stock" && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <SalesByProductChart data={filteredSales} />
          </div>
        )}

        {mode !== "sales" && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <StockChart data={filteredProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
