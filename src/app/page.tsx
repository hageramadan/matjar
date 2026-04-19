import { HeroCover } from "@/components/home/HeroCover";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { AdvSection } from "@/components/home/AdvSection";

export default function Home() {
  return (
    <main>
      <HeroCover />
      <CategoriesSection />
      <ProductsSection />
      <AdvSection />
    </main>
  );
}