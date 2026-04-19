"use client";
import { ProductGrid } from "@/components/products/ProductGrid";

const sampleProducts = [
  { id: 1, name: "منتج 1", price: 299, image: "/product1.jpg", rating: 4.5 },
  { id: 2, name: "منتج 2", price: 199, image: "/product2.jpg", rating: 4.2 },
  { id: 3, name: "منتج 3", price: 499, image: "/product3.jpg", rating: 4.8 },
  { id: 4, name: "منتج 4", price: 99, image: "/product4.jpg", rating: 4.0 },
];

export function ProductsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">أحدث المنتجات</h2>
          <button className="text-primary hover:underline">عرض الكل →</button>
        </div>
        <ProductGrid products={sampleProducts} />
      </div>
    </section>
  );
}