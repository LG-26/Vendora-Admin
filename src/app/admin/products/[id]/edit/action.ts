"use server";

import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { productSchema } from "@/lib/validators/product";
import { redirect } from "next/navigation";

export async function updateProduct(id: string, formData: FormData) {
  const file = formData.get("image") as File | null;

  let imageUrl: string | undefined = undefined;

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

  await connectDB();

  // Get existing product to preserve imageUrl if no new image is uploaded
  const existingProduct = await Product.findById(id).lean();
  if (!existingProduct) {
    throw new Error("Product not found");
  }

  const rawData = {
    name: formData.get("name"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    imageUrl: imageUrl || (existingProduct as any).imageUrl || "",
  };

  const parsed = productSchema.safeParse(rawData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const updateData: any = {
    name: parsed.data.name,
    price: parsed.data.price,
    stock: parsed.data.stock,
  };

  if (parsed.data.imageUrl) {
    updateData.imageUrl = parsed.data.imageUrl;
  }

  await Product.findByIdAndUpdate(id, updateData);

  redirect("/admin/products");
}



