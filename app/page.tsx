import { CategoriesDragDrop } from "@/components/home/CategoriesDragDrop";
import { Hero } from "@/components/home/HeroCover";
import { LatestProducts, } from "@/components/home/LatestProducts";
import { ProductCard, ProductsGrid } from "@/components/products/ProductCard";
import Image from "next/image";

export default function Home() {
  return (
   <div>
    <Hero />
    <CategoriesDragDrop />
   <LatestProducts />
{/* <ProductsGrid /> */}
   </div>
  );
}
