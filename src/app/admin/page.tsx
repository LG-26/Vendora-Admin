import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import StockChart from "@/components/StockChart";

export default async function AdminDashboard() {
  await connectDB();

  const products = await Product.find().lean();

  const totalProducts = products.length;
  const totalStock = products.reduce(
    (sum: number, product: any) => sum + product.stock,
    0
  );

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
        Admin Dashboard
      </h1>

      <p>Total Products: {totalProducts}</p>
      <p>Total Stock: {totalStock}</p>

      <div style={{ marginTop: "32px" }}>
        <h2>Stock per Product</h2>
        <StockChart data={products} />
      </div>
    </div>
  );
}
