import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import StockChart from "@/components/StockChart";
import RevenueChart from "@/components/RevenueChart";
import SalesByProductChart from "@/components/SalesByProductChart";
import TopProductsChart from "@/components/TopProductsChart";
import Link from "next/link";
import DashboardSearch from "@/components/DashboardSearch";

export default async function AdminDashboard() {
  await connectDB();

  const products = await Product.find().lean();
  const orders = await Order.find().lean();

  const completedOrders = orders.filter((order: any) => order.status === "completed");
  const pendingOrders = orders.filter((order: any) => order.status === "pending");
  const cancelledOrders = orders.filter((order: any) => order.status === "cancelled");

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum: number, product: any) => sum + product.stock,
    0
  );
  const totalValue = products.reduce(
    (sum: number, product: any) => sum + product.price * product.stock,
    0
  );
  const lowStockProducts = products.filter((product: any) => product.stock < 10).length;

  const totalRevenue = completedOrders.reduce(
    (sum: number, order: any) => sum + order.totalAmount,
    0
  );
  const totalOrders = completedOrders.length;
  const pendingCount = pendingOrders.length;
  const cancelledCount = cancelledOrders.length;

  const totalUnitsSold = completedOrders.reduce(
    (sum: number, order: any) =>
      sum + order.items.reduce((s: number, it: any) => s + (it.quantity || 0), 0),
    0
  );

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const revenueData = last7Days.map((date) => {
    const dayOrders = completedOrders.filter((order: any) => {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      return orderDate === date;
    });
    return {
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: dayOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0),
      orders: dayOrders.length,
    };
  });

  const productSalesMap: Record<string, { name: string; sales: number; revenue: number }> = {};

  products.forEach((p: any) => {
    productSalesMap[p._id.toString()] = {
      name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
      sales: 0,
      revenue: 0,
    };
  });

  completedOrders.forEach((order: any) => {
    order.items.forEach((it: any) => {
      const pid = it.productId.toString();
      if (!productSalesMap[pid]) {
        productSalesMap[pid] = {
          name: it.productName.length > 15 ? it.productName.substring(0, 15) + "..." : it.productName,
          sales: 0,
          revenue: 0,
        };
      }
      productSalesMap[pid].sales += it.quantity || 0;
      productSalesMap[pid].revenue += (it.price || 0) * (it.quantity || 0);
    });
  });

  const salesByProduct = Object.values(productSalesMap).filter((item) => item.sales > 0);

  const topProducts = Object.values(productSalesMap)
    .map((item) => ({
      name: item.name.length > 20 ? item.name.substring(0, 20) + "..." : item.name,
      sales: item.sales,
    }))
    .filter((item) => item.sales > 0)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 10);

  const recentOrders = orders
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Overview of your store performance</p>
        </div>
        <div className="flex gap-3">
          <DashboardSearch />
          <Link
            href="/admin/products/add"
            className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-linear-to-br from-purple-50 to-purple-100 p-6 rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">All-time sales</p>
        </div>

        <div className="bg-linear-to-br from-indigo-50 to-indigo-100 p-6 rounded-2xl shadow-lg border border-indigo-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-indigo-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
          <p className="text-xs text-gray-500 mt-2">Completed orders</p>
        </div>

        <div className="bg-linear-to-br from-pink-50 to-pink-100 p-6 rounded-2xl shadow-lg border border-pink-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Total Products</p>
          <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
          <p className="text-xs text-gray-500 mt-2">Active products</p>
        </div>

        <div className="bg-linear-to-br from-cyan-50 to-cyan-100 p-6 rounded-2xl shadow-lg border border-cyan-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-cyan-600 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Units Sold</p>
          <p className="text-3xl font-bold text-gray-900">{totalUnitsSold.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Total sales</p>
        </div>

        <div className="bg-linear-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl shadow-lg border border-yellow-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l2 2m6-2a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Pending Orders</p>
          <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
          <p className="text-xs text-gray-500 mt-2">Awaiting completion</p>
        </div>

        <div className="bg-linear-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-lg border border-red-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-500 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10 3h4l1 2h4a1 1 0 011 1v2M5 7h14l-1 12H6L5 7z" />
              </svg>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Cancelled Orders</p>
          <p className="text-3xl font-bold text-gray-900">{cancelledCount}</p>
          <p className="text-xs text-gray-500 mt-2">Not fulfilled</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <p className="text-sm font-semibold text-gray-600 mb-2">Inventory Value</p>
          <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Current stock value</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <p className="text-sm font-semibold text-gray-600 mb-2">Total Stock</p>
          <p className="text-2xl font-bold text-gray-900">{totalStock.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Units in inventory</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <p className="text-sm font-semibold text-gray-600 mb-2">Low Stock Items</p>
          <p className="text-2xl font-bold text-red-600">{lowStockProducts}</p>
          <p className="text-xs text-gray-500 mt-2">Need restocking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
            <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
          </div>
          <RevenueChart data={revenueData} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Selling Products</h2>
            <p className="text-sm text-gray-500 mt-1">Best performers</p>
          </div>
          {topProducts.length > 0 ? (
            <TopProductsChart data={topProducts} />
          ) : (
            <div className="flex items-center justify-center h-75 text-gray-500">
              No sales data available
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Sales by Product</h2>
            <p className="text-sm text-gray-500 mt-1">Units sold & revenue</p>
          </div>
          {salesByProduct.length > 0 ? (
            <SalesByProductChart data={salesByProduct} />
          ) : (
            <div className="flex items-center justify-center h-75 text-gray-500">
              No sales data available
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Stock per Product</h2>
            <p className="text-sm text-gray-500 mt-1">Current inventory levels</p>
          </div>
          <StockChart data={products} />
        </div>
      </div>

      {recentOrders.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-1">Latest activity across all statuses</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.customerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.items.length} item(s)</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
