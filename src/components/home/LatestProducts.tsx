import { ProductsSection } from "../products/ProductsSection";


export function LatestProducts() {
  return (
    <ProductsSection 
      title="أحدث المنتجات"
      apiEndpoint="/api/products/new-products"
    />
  );
}