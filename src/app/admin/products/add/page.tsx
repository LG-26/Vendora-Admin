"use client";

import { useState } from "react";
import { addProduct } from "./action";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/lib/constants/categories";

export default function AddProductPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string>(PRODUCT_CATEGORIES[0]);
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);

  function handleNext() {
    if (!name || !price) return;
    setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

  async function handleSubmit(formData: FormData) {
    if (image) {
      formData.set("image", image);
    }
    formData.set("name", name);
    formData.set("price", price);
    formData.set("category", category);
    formData.set("stock", stock);
    await addProduct(formData);
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Add New Product
        </h1>
        <p className="text-gray-600">Step {step} of 2</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className={`flex-1 h-3 rounded-full transition-all duration-500 ${step >= 1 ? "bg-linear-to-r from-purple-600 to-indigo-600" : "bg-gray-200"}`}></div>
          <div className={`flex-1 h-3 rounded-full transition-all duration-500 ${step >= 2 ? "bg-linear-to-r from-purple-600 to-indigo-600" : "bg-gray-200"}`}></div>
        </div>
      </div>

      <div className="relative perspective-1000 mb-32" style={{ minHeight: "650px" }}>
        <div
          className="relative preserve-3d transition-transform duration-600"
          style={{
            transformStyle: "preserve-3d",
            transform: step === 2 ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="backface-hidden absolute inset-0 w-full"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
            }}
          >
            <div className="bg-linear-to-br from-white via-purple-50/30 to-indigo-50/30 rounded-3xl shadow-2xl border border-purple-100/50 p-8 h-full flex flex-col">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Information</h2>
                <p className="text-gray-600">Enter basic product details</p>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="price"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end pt-4 mt-auto">
                  <button
                    className="px-8 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    onClick={handleNext}
                    disabled={!name || !price}
                  >
                    Next Step
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="backface-hidden absolute inset-0 w-full"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="bg-linear-to-br from-white via-indigo-50/30 to-purple-50/30 rounded-3xl shadow-2xl border border-indigo-100/50 p-8 h-full flex flex-col">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Details</h2>
                <p className="text-gray-600">Complete product information</p>
              </div>

              <form action={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                <div>
                  <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-2">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="stock"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white"
                    type="number"
                    name="stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Image
                  </label>
                  <div className="relative">
                    <input
                      id="image"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                    {image && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Selected: {image.name}</p>
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Upload an image for your product (optional)</p>
                </div>

                <div className="flex justify-between pt-4 mt-auto">
                  <button
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center gap-2"
                    type="button"
                    onClick={handleBack}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>

                  <button
                    className="px-8 py-3 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                    type="submit"
                  >
                    Create Product
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 relative z-0">
        <Link
          href="/admin/products"
          className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
      </div>
    </div>
  );
}
