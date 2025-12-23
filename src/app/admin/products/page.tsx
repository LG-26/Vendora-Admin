import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { redirect } from "next/navigation";

export default async function ProductsPage() {
  await connectDB();

  const products = await Product.find();

  console.log("Fetched products from DB");

  async function deleteProduct(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;

  await connectDB();
  await Product.findByIdAndDelete(id);

  redirect("/admin/products");
}


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
              <td>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product._id} />
                  <button type="submit">Delete</button>
                </form>
              </td>
              <td>
                <a href={`/admin/products/${product._id}/edit`}>
                  Edit
                </a>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
