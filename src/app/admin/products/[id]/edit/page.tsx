import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { redirect } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();
  const product = await Product.findById(params.id).lean();

  async function updateProduct(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));

    await connectDB();
    await Product.findByIdAndUpdate(params.id, {
      name,
      price,
      stock,
    });

    redirect("/admin/products");
  }

  return (
    <div>
      <h1>Edit Product</h1>

      <form action={updateProduct}>
        <input type="text" name="name" defaultValue={product.name} />
        <input type="number" name="price" defaultValue={product.price} />
        <input type="number" name="stock" defaultValue={product.stock} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
