export const PRODUCT_CATEGORIES = [
  "Mobile and Accessories",
  "Computer and Accessories",
  "Home Appliances",
  "Smart Home and Gadgets",
  "Gaming and Entertainment",
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

