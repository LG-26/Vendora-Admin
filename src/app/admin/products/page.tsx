import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";

export default async function ProductsPage() {
  await connectDB();

  const products = await Product.find();

  console.log("Fetched products from DB");

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Products (From Database)
      </h1>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product: any) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>₹{product.price}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
