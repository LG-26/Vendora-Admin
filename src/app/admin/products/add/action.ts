"use server";

import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { productSchema } from "@/lib/validators/product";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
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
