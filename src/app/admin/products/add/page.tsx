"use client";

import { useState } from "react";
import { addProduct } from "./action";

export default function AddProductPage() {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  return (
    <div>
      <h1>Add Product (Step {step} of 2)</h1>

      <form action={addProduct}>
        {step === 1 && (
          <>
            <div>
              <label>Product Name</label>
              <br />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label>Price</label>
              <br />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <button type="button" onClick={() => setStep(2)}>
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* hidden inputs to preserve step 1 data */}
            <input type="hidden" name="name" value={name} />
            <input type="hidden" name="price" value={price} />

            <div>
              <label>Stock</label>
              <br />
              <input type="number" name="stock" required />
            </div>

            <button type="button" onClick={() => setStep(1)}>
              Back
            </button>

            <button type="submit">
              Create Product
            </button>
          </>
        )}
      </form>
    </div>
  );
}
