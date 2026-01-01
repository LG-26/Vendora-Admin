import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { redirect } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  await connectDB();
  const product = await Product.findById(params.id).lean();

  if (!product) {
    notFound();
  }

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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {product.imageUrl && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
            <div className="w-32 h-32 overflow-hidden rounded-lg border border-gray-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <form action={updateProduct} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              defaultValue={product.name}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              id="price"
              type="number"
              name="price"
              defaultValue={product.price}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              id="stock"
              type="number"
              name="stock"
              defaultValue={product.stock}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div className="flex justify-between pt-4">
            <Link
              href="/admin/products"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>

      <div className="mt-4">
        <Link
          href="/admin/products"
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          ← Back to Products
        </Link>
      </div>
    </div>
  );
}
