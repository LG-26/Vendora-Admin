"use client";

import { useState } from "react";
import { addProduct } from "./action";
import Link from "next/link";

export default function AddProductPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
        <p className="text-gray-600">Step {step} of 2</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? "bg-purple-600" : "bg-gray-200"}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? "bg-purple-600" : "bg-gray-200"}`}></div>
          </div>
        </div>

        <form action={addProduct} className="space-y-6">
          {step === 1 && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  type="button"
                  onClick={() => setStep(2)}
                >
                  Next →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Hidden inputs to preserve step 1 data */}
              <input type="hidden" name="name" value={name} />
              <input type="hidden" name="price" value={price} />

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  id="stock"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  type="number"
                  name="stock"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <input
                  id="image"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  type="file"
                  name="image"
                  accept="image/*"
                />
                <p className="mt-2 text-sm text-gray-500">Upload an image for your product (optional)</p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                  type="button"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>

                <button
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                  type="submit"
                >
                  Create Product
                </button>
              </div>
            </>
          )}
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
