import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import StockChart from "@/components/StockChart";
import RevenueChart from "@/components/RevenueChart";
import SalesByProductChart from "@/components/SalesByProductChart";
import TopProductsChart from "@/components/TopProductsChart";
import Link from "next/link";

export default async function AdminDashboard() {
  await connectDB();

  const products = await Product.find().lean();
  const orders = await Order.find({ status: "completed" }).lean();

  // Calculate metrics
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
  
  // Sales metrics
  const totalRevenue = orders.reduce(
    (sum: number, order: any) => sum + order.totalAmount,
    0
  );
  const totalOrders = orders.length;
  const totalUnitsSold = products.reduce(
    (sum: number, product: any) => sum + (product.salesCount || 0),
    0
  );

  // Calculate revenue for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const revenueData = last7Days.map((date) => {
    const dayOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      return orderDate === date;
    });
    return {
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: dayOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0),
      orders: dayOrders.length,
    };
  });

  // Sales by product
  const salesByProduct = products.map((product: any) => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name,
    sales: product.salesCount || 0,
    revenue: product.revenue || 0,
  })).filter(item => item.sales > 0);

  // Top products
  const topProducts = products
    .map((product: any) => ({
      name: product.name.length > 20 ? product.name.substring(0, 20) + "..." : product.name,
      sales: product.salesCount || 0,
    }))
    .filter(item => item.sales > 0);

  // Recent orders (last 5)
  const recentOrders = orders
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your store</p>
        </div>
        <Link
          href="/admin/products/add"
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          + Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">All-time sales</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
          <p className="text-xs text-gray-500 mt-2">Completed orders</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-2">Total Products</p>
          <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
          <p className="text-xs text-gray-500 mt-2">Active products</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-2">Units Sold</p>
          <p className="text-3xl font-bold text-gray-900">{totalUnitsSold.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Total sales</p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-2">Inventory Value</p>
          <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Current stock value</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-2">Total Stock</p>
          <p className="text-2xl font-bold text-gray-900">{totalStock.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Units in inventory</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm font-medium text-gray-500 mb-2">Low Stock Items</p>
          <p className="text-2xl font-bold text-red-600">{lowStockProducts}</p>
          <p className="text-xs text-gray-500 mt-2">Need restocking</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Revenue Trend</h2>
            <p className="text-sm text-gray-500 mt-1">Last 7 days</p>
          </div>
          <RevenueChart data={revenueData} />
        </div>

        {/* Top Products Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Top Selling Products</h2>
            <p className="text-sm text-gray-500 mt-1">Best performers</p>
          </div>
          {topProducts.length > 0 ? (
            <TopProductsChart data={topProducts} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No sales data available
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Product */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Sales by Product</h2>
            <p className="text-sm text-gray-500 mt-1">Units sold & revenue</p>
          </div>
          {salesByProduct.length > 0 ? (
            <SalesByProductChart data={salesByProduct} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No sales data available
            </div>
          )}
        </div>

        {/* Stock Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Stock per Product</h2>
            <p className="text-sm text-gray-500 mt-1">Current inventory levels</p>
          </div>
          <StockChart data={products} />
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-1">Latest completed orders</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.customerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.items.length} item(s)</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">₹{order.totalAmount.toLocaleString()}</td>
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
