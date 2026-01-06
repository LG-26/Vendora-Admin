"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopProduct {
  name: string;
  sales: number;
}

export default function TopProductsChart({ data }: { data: TopProduct[] }) {
  const topProducts = [...data].sort((a, b) => b.sales - a.sales).slice(0, 5);

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={topProducts} layout="vertical" margin={{ top: 12, right: 16, bottom: 12, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" />
          <YAxis dataKey="name" type="category" stroke="#6b7280" width={120} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="sales" fill="#f59e0b" radius={[0, 8, 8, 0]} name="Units Sold" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}







