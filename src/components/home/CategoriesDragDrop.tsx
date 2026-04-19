"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  image: string;
  href: string;
}

const initialCategories: Category[] = [
  {
    id: "1",
    name: "إلكترونيات",
    image: "/images/categories/cate1.png",
    href: "/categories/electronics",
  },
  {
    id: "2",
    name: "ملابس",
    image: "/images/categories/cate2.png",
    href: "/categories/clothing",
  },
  {
    id: "3",
    name: "أحذية",
    image: "/images/categories/cate3.png",
    href: "/categories/shoes",
  },
  {
    id: "4",
    name: "مستحضرات تجميل",
    image: "/images/categories/cate4.png",
    href: "/categories/beauty",
  },
  {
    id: "5",
    name: "منزل ومطبخ",
    image: "/images/categories/cate5.png",
    href: "/categories/home",
  },
  {
    id: "6",
    name: "رياضة",
    image: "/images/categories/cate1.png",
    href: "/categories/sports",
  },
  {
    id: "24",
    name: "مستحضرات تجميل",
    image: "/images/categories/cate4.png",
    href: "/categories/beauty",
  },
  {
    id: "25",
    name: "منزل ومطبخ",
    image: "/images/categories/cate5.png",
    href: "/categories/home",
  },
  {
    id: "26",
    name: "رياضة",
    image: "/images/categories/cate1.png",
    href: "/categories/sports",
  },
  {
    id: "14",
    name: "مستحضرات تجميل",
    image: "/images/categories/cate4.png",
    href: "/categories/beauty",
  },
  {
    id: "15",
    name: "منزل ومطبخ",
    image: "/images/categories/cate5.png",
    href: "/categories/home",
  },
  {
    id: "16",
    name: "رياضة",
    image: "/images/categories/cate1.png",
    href: "/categories/sports",
  },
];

export function CategoriesDragDrop() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const itemsPerView = 6;
  const totalSlides = Math.ceil(initialCategories.length / itemsPerView);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrev = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartX.current = null;
  };

  const startIndex = currentIndex * itemsPerView;
  const visibleCategories = initialCategories.slice(startIndex, startIndex + itemsPerView);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="mb-8 ">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#112B40' }}>
            الأقسام
          </h2>
        
        </div>

        {/* Slider Container */}
        <div className="relative px-8 md:px-12">
          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-[#2DA5F3] text-white rounded-full shadow-lg p-2  transition-all duration-300 hover:scale-110"
                style={{ border: '1px solid #e2e8f0' }}
                aria-label="السابق"
              >
                <ChevronLeft className="h-5 w-5" style={{ color: '#ffffff' }} />
              </button>

              <button
                onClick={goToNext}
                className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-[#2DA5F3] text-white rounded-full shadow-lg p-2  transition-all duration-300 hover:scale-110"
                style={{ border: '1px solid #e2e8f0' }}
                aria-label="التالي"
              >
                <ChevronRight className="h-5 w-5" style={{ color: '#ffffff' }} />
              </button>
            </>
          )}

          {/* Slides */}
          <div
            ref={containerRef}
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className={`transition-all duration-500 ease-in-out ${
                isTransitioning ? 'opacity-50' : 'opacity-100'
              }`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                {visibleCategories.map((category) => (
                  <div
                    key={category.id}
                    className="group transition-all duration-200 animate-in fade-in zoom-in duration-500"
                  >
                    <Link href={category.href}>
                      <div 
                        className="bg-white border-2 border-gray-200 transition-all duration-300 hover:shadow-xl overflow-hidden cursor-pointer "
                        style={{ 
                          width: '198.33px',
                          height: '236px',
                          borderRadius: '4px'
                        }}
                      >
                        {/* Image */}
                        <div className="relative w-full" style={{ height: 'calc(100% - 50px)' }}>
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Category Name */}
                        <div className="p-3 text-center" style={{ height: '50px' }}>
                          <h3 className="text-sm md:text-base font-semibold" style={{ color: '#112B40' }}>
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        {/* {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? "w-8 h-2 bg-[#23A6F0]"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )} */}
      </div>
    </section>
  );
}