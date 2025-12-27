"use server";

import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { productSchema } from "@/lib/validators/product";
import { redirect } from "next/navigation";

export async function addProduct(formData: FormData) {
  const file = formData.get("image") as File | null;

  let imageUrl = "";

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());

    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "products" }, (err, res) => {
          if (err) reject(err);
          resolve(res);
        })
        .end(buffer);
    });

    imageUrl = result.secure_url;
  }

  const rawData = {
    name: formData.get("name"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    imageUrl,
  };

  const parsed = productSchema.safeParse(rawData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  await connectDB();
  await Product.create(parsed.data);

  redirect("/admin/products");
}
