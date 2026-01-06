import { z } from "zod";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  category: z.enum([
    "Mobile and Accessories",
    "Computer and Accessories",
    "Home Appliances",
    "Smart Home and Gadgets",
    "Gaming and Entertainment",
  ] as [string, ...string[]]),
  imageUrl: z.string().optional(),
});
