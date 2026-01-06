import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Mobile and Accessories",
        "Computer and Accessories",
        "Home Appliances",
        "Smart Home and Gadgets",
        "Gaming and Entertainment",
      ],
      default: "Mobile and Accessories",
    },
    imageUrl: {
      type: String,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    revenue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);