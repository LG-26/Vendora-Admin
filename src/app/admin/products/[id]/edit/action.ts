"use server";

import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
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

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));

  await connectDB();

  const updateData: any = {
    name,
    price,
    stock,
  };

  if (imageUrl) {
    updateData.imageUrl = imageUrl;
  }

  await Product.findByIdAndUpdate(id, updateData);

  redirect("/admin/products");
}

