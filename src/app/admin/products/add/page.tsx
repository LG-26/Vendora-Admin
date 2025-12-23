import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { redirect } from "next/navigation";
import { productSchema } from "@/lib/validators/product";

export default function AddProductPage() {

  async function addProduct(formData: FormData) {
    "use server";

    const rawData = {
    name: formData.get("name"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
  };

  const parsed = productSchema.safeParse(rawData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  await connectDB();
  await Product.create(parsed.data);

    redirect("/admin/products");
  }

  return (
    <div>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Add Product
      </h1>

      <form action={addProduct}>
        <div style={{ marginBottom: "12px" }}>
          <label>Product Name</label>
          <br />
          <input type="text" name="name" required />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Price</label>
          <br />
          <input type="number" name="price" required />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Stock</label>
          <br />
          <input type="number" name="stock" required />
        </div>

        <button type="submit">
          Add Product
        </button>
      </form>
    </div>
  );
}
