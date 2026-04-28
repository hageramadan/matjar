import { ProductsSection } from "../products/ProductsSection";

export function BestProducts() {
  return (
    <ProductsSection 
      title="الأكثر طلبا"
      apiEndpoint="/api/products/most-selling-products"
    />
  );
}