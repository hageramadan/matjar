"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";

// ============= واجهات البيانات =============
interface Slide {
  id: number;
  sub_title: string | null;
  name: string;
  description: string | null;
  link: string | null;
  image: string;
  is_active: number;
}

interface ApiResponse {
  result: boolean;
  errNum: number;
  message: string;
  data: {
    sliders: Slide[];
  };
}

const API_BASE_URL = 'https://alfareed.admin.t-carts.com';

export function Hero() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // متغيرات للسحب باللمس
  const touchStartX = useRef<number>(0);
  const [dragProgress, setDragProgress] = useState(0); // 0 إلى 1 أو -1
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // جلب السلايدر من API
  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/api/sliders`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.errNum === 200 && data.result === true) {
          const activeSliders = data.data.sliders.filter(slider => slider.is_active === 1);
          setSlides(activeSliders);
        } else {
          throw new Error(data.message || 'فشل في تحميل السلايدر');
        }
      } catch (err) {
        console.error('Error fetching sliders:', err);
        setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل السلايدر');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToNextSlide = () => {
    if (slides.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevSlide = () => {
    if (slides.length === 0) return;
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // ============= دوال السحب المتقدم =============
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setIsAutoPlaying(false);
    setDragProgress(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const currentX = e.touches[0].clientX;
    const diffX = currentX - touchStartX.current;
    const containerWidth = containerRef.current.clientWidth;
    
    // حساب نسبة السحب (من -1 إلى 1)
    let progress = diffX / containerWidth;
    // تحديد أقصى نسبة سحب (50% كحد أقصى)
    progress = Math.min(Math.max(progress, -0.5), 0.5);
    
    setDragProgress(progress);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const minSwipeDistance = 0.15; // 15% كحد أدنى للسحب
    
    if (Math.abs(dragProgress) > minSwipeDistance) {
      // سحب لليسار (قيمة سالبة) -> السلايد التالي
      if (dragProgress < 0) {
        goToNextSlide();
      } 
      // سحب لليمين (قيمة موجبة) -> السلايد السابق
      else if (dragProgress > 0) {
        goToPrevSlide();
      }
    }
    
    // إعادة تعيين القيم
    setIsDragging(false);
    setDragProgress(0);
    touchStartX.current = 0;
    
    // استئناف التشغيل التلقائي بعد 10 ثواني
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // حساب مؤشرات السلايدات المجاورة
  const getPrevIndex = () => {
    return currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
  };

  const getNextIndex = () => {
    return (currentSlide + 1) % slides.length;
  };

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <section className="relative w-full h-[70vh] overflow-hidden bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#23A6F0] border-r-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  // في حالة الخطأ أو عدم وجود سلايدرات
  if (error || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[70vh] overflow-hidden bg-gray-900">
      {/* Slides Container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y pinch-zoom' }} // منع التداخل مع التمرير العمودي
      >
        <div className="relative w-full h-full">
          {/* السلايد السابق (يظهر عند السحب لليمين) */}
          <div 
            className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(calc(-100% + ${dragProgress * 100}%))`,
              zIndex: dragProgress > 0 ? 5 : 1,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={`${API_BASE_URL}${slides[getPrevIndex()].image}`}
                alt={slides[getPrevIndex()].name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>

          {/* السلايد الحالي */}
          <div 
            className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(${dragProgress * 100}%)`,
              zIndex: 10,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={`${API_BASE_URL}${slides[currentSlide].image}`}
                alt={slides[currentSlide].name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="container-custom text-center text-white gap-3 pointer-events-auto">
                <h1 className="text-3xl md:text-5xl lg:text-[58px] font-bold mb-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                  {slides[currentSlide].name}
                </h1>
                
                {slides[currentSlide].description && (
                  <p className="text-base md:text-lg lg:text-[20px] mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                    {slides[currentSlide].description}
                  </p>
                )}
                
                <Button
                  asChild
                  className="animate-in text-[16px] font-bold fade-in slide-in-from-bottom-5 duration-700 delay-200 rounded-xl"
                  style={{ 
                    backgroundColor: '#23A6F0',
                    width: '177px',
                    height: '56px'
                  }}
                >
                  <Link 
                    href={slides[currentSlide].link || "/products"} 
                    className="flex items-center justify-center gap-2"
                  >
                    تسوق الآن
                    <FaArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* السلايد التالي (يظهر عند السحب لليسار) */}
          <div 
            className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(calc(100% - ${Math.abs(dragProgress) * 100}%))`,
              zIndex: dragProgress < 0 ? 5 : 1,
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={`${API_BASE_URL}${slides[getNextIndex()].image}`}
                alt={slides[getNextIndex()].name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        </div>
      </div>

      {/* مؤشر السحب (اختياري - يظهر فقط أثناء السحب) */}
      {isDragging && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
            {dragProgress < 0 ? (
              <ChevronRight className="h-8 w-8 text-white" />
            ) : dragProgress > 0 ? (
              <ChevronLeft className="h-8 w-8 text-white" />
            ) : null}
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevSlide}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>

          <button
            onClick={goToNextSlide}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? "w-8 h-2 bg-[#23A6F0]"
                  : "w-2 h-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}