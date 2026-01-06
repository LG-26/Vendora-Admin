"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SalesByProductPoint {
  name: string;
  sales: number;
  revenue: number;
}

export default function SalesByProductChart({ data }: { data: SalesByProductPoint[] }) {
  return (
    <div style={{ width: "100%", height: 340 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 48, right: 12, bottom: 40, left: 12 }}
          barCategoryGap="16%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
          <YAxis yAxisId="left" stroke="#6b7280" />
          <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Legend verticalAlign="top" align="center" />

          <Bar
            dataKey="sales"
            fill="#10b981"
            name="Units Sold"
            radius={[8, 8, 0, 0]}
            barSize={28}
            yAxisId="left"
          />

          <Bar
            dataKey="revenue"
            fill="#8b5cf6"
            name="Revenue (₹)"
            radius={[8, 8, 0, 0]}
            barSize={28}
            yAxisId="right"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}







