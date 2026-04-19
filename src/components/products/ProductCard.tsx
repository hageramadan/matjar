"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  href: string;
  originalPrice?: number;
  discount?: number;
}

export function ProductCard({ 
  id, 
  name, 
  price, 
  image, 
  href,
  originalPrice,
  discount 
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic here
    console.log("Added to cart:", id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view logic here
    console.log("Quick view:", id);
  };

  return (
    <div
      className="group relative bg-white transition-all duration-300 hover:shadow-lg"
      style={{
        width: '308px',
        height: '386px',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '16px 0'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={href} className="block h-full">
        {/* Image Container */}
        <div 
          className="relative mx-auto transition-colors duration-300"
          style={{
            width: 'calc(100% - 32px)',
            height: 'calc(100% - 80px)',
            backgroundColor: isHovered ? '#E4F0FA' : '#f3f4f6',
            borderRadius: '8px',
            margin: '0 16px'
          }}
        >
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Icons Overlay - appears at bottom center on hover */}
          {isHovered && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 animate-in fade-in zoom-in-95 duration-200">
              {/* Eye Icon - Quick View */}
              <button
                onClick={handleQuickView}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                style={{ color: '#112B40' }}
                aria-label="معاينة سريعة"
              >
                <Eye className="h-5 w-5" />
              </button>

              {/* Shopping Cart Icon - Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                style={{ color: '#112B40' }}
                aria-label="أضف إلى السلة"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>

              {/* Heart Icon - Add to Favorites */}
              <button
                onClick={handleFavoriteClick}
                className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                style={{ color: isFavorite ? '#ef4444' : '#112B40' }}
                aria-label="أضف إلى المفضلة"
              >
                <Heart className="h-5 w-5" fill={isFavorite ? '#ef4444' : 'none'} />
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 mt-3 text-center">
          {/* Product Name */}
          <h3 className="text-sm font-medium line-clamp-2 mb-1" style={{ color: '#112B40' }}>
            {name}
          </h3>

          {/* Price */}
          <div className="flex items-center  gap-2">
            {/* {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {originalPrice.toLocaleString()} EGP
              </span>
            )} */}
            <span className="text-lg font-bold" style={{ color: '#23A6F0' }}>
              {price.toLocaleString()} EGP
            </span>
          </div>

          {/* Discount Badge */}
          {/* {discount && discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              -{discount}%
            </div>
          )} */}
        </div>
      </Link>
    </div>
  );
}

// Example usage with multiple products
export function ProductsGrid() {
  const products = [
    {
      id: "1",
      name: "سماعات لاسلكية عالية الجودة مع قاعدة شحن",
      price: 25000,
      originalPrice: 35000,
      discount: 28,
      image: "/images/products/p1.png",
      href: "/products/1",
    },
    {
      id: "2",
      name: "ساعة ذكية رياضية",
      price: 150000,
      image: "/images/products/p2.png",
      href: "/products/2",
    },
    {
      id: "3",
      name: "حقيبة ظهر عصرية",
      price: 45000,
      originalPrice: 60000,
      discount: 25,
      image: "/images/products/p3.png",
      href: "/products/3",
    },
    {
      id: "4",
      name: "سماعة ألعاب احترافية",
      price: 85000,
      image: "/images/products/p4.png",
      href: "/products/4",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: '#112B40' }}>
          منتجات مميزة
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}