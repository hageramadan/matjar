"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ShoppingCart, User, Search, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { name: "الرئيسية", href: "/" },
  { name: "الفئات", href: "/categories", hasDropdown: true },
  { name: "تواصل معنا", href: "/contact" },
  { name: "تواصل معنا", href: "/contactUs" },
];

// Categories dropdown items
const categories = [
  { name: "إلكترونيات", href: "/categories/electronics" },
  { name: "ملابس", href: "/categories/clothing" },
  { name: "أحذية", href: "/categories/shoes" },
  { name: "مستحضرات تجميل", href: "/categories/beauty" },
  { name: "منزل ومطبخ", href: "/categories/home" },
  { name: "رياضة", href: "/categories/sports" },
];

export function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { favoritesCount } = useFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Focus on search input when shown
  useEffect(() => {
    if (showSearchInput && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [showSearchInput]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setShowSearchInput(false);
      setSearchQuery("");
    }
  };

  // Close search input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSearchInput && searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchInput(false);
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchInput]);

  // Close categories dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCategoriesDropdown && categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setShowCategoriesDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCategoriesDropdown]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSearchInput) {
        setShowSearchInput(false);
        setSearchQuery("");
      }
      if (e.key === 'Escape' && showCategoriesDropdown) {
        setShowCategoriesDropdown(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSearchInput, showCategoriesDropdown]);

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: 'white' }}>
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-[32px] font-bold transition-colors shrink-0"
            style={{ color: '#23A6F0' }}
          >
            Logo
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div key={link.href} className="relative" ref={categoriesRef}>
                  <button
                    className="flex items-center gap-1 text-[16px] transition-colors hover:text-[#23A6F0]"
                    style={{ 
                      color: pathname.startsWith('/categories') ? '#23A6F0' : '#112B40',
                      fontWeight: pathname.startsWith('/categories') ? '700' : '400'
                    }}
                    onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                    onMouseEnter={() => setShowCategoriesDropdown(true)}
                  >
                    {link.name}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Categories Dropdown */}
                  {showCategoriesDropdown && (
                    <div 
                      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg border shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200"
                      style={{ borderColor: '#e2e8f0' }}
                      onMouseLeave={() => setShowCategoriesDropdown(false)}
                    >
                      <div className="py-2">
                        {categories.map((category) => (
                          <Link
                            key={category.href}
                            href={category.href}
                            className="block px-4 py-2 text-[14px] transition-colors hover:bg-gray-50"
                            style={{ color: '#112B40' }}
                            onClick={() => setShowCategoriesDropdown(false)}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#23A6F0'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#112B40'}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[16px] transition-colors hover:text-[#23A6F0]"
                  style={{ 
                    color: pathname === link.href ? '#23A6F0' : '#112B40',
                    fontWeight: pathname === link.href ? '700' : '400'
                  }}
                >
                  {link.name}
                </Link>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Search Button & Overlay Input */}
            <div className="relative" ref={searchContainerRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSearchInput(!showSearchInput)}
                className="relative z-10 hover:bg-gray-100"
                style={{ color: '#195073' }}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Search Overlay for Desktop */}
              {showSearchInput && (
                <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 mt-2 w-screen max-w-md px-4">
                  <div className="relative">
                    <form onSubmit={handleSearch}>
                      <div className="relative bg-white rounded-lg border shadow-xl" style={{ borderColor: '#e2e8f0' }}>
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#94a3b8' }} />
                        <Input
                          ref={searchInputRef}
                          type="search"
                          placeholder="ابحث عن منتج..."
                          className="w-full h-11 pr-9 border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-offset-0"
                          style={{ 
                            color: '#195073',
                            '--tw-ring-color': '#23A6F0'
                          } as React.CSSProperties}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                            style={{ color: '#94a3b8' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#195073'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </form>
                    {/* Arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-l border-t" style={{ borderColor: '#e2e8f0' }}></div>
                  </div>
                </div>
              )}
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              asChild 
              className="relative hover:bg-gray-100"
              style={{ color: '#195073' }}
            >
              <Link href="/favorites">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] text-white flex items-center justify-center" style={{ backgroundColor: '#ef4444' }}>
                    {favoritesCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              asChild 
              className="relative hover:bg-gray-100"
              style={{ color: '#195073' }}
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-[10px] text-white flex items-center justify-center" style={{ backgroundColor: '#23A6F0' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </Button>

            <Button 
              variant="ghost" 
              asChild 
              className="hidden sm:inline-flex hover:bg-gray-100 gap-2"
              style={{ color: '#195073' }}
            >
              <Link href="/auth/login">
                <User className="h-5 w-5" />
               <span className="text-[14px] font-bold "> تسجيل دخول</span>
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-gray-100"
              style={{ color: '#195073' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {showSearchInput && (
          <div className="md:hidden fixed inset-x-0 top-16 z-50 bg-white border-b shadow-xl animate-in slide-in-from-top-2 duration-200" style={{ borderColor: '#e2e8f0' }}>
            <div className="container-custom py-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#94a3b8' }} />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="ابحث عن منتج..."
                  className="w-full h-11 pr-9 bg-gray-50 focus-visible:ring-1 focus-visible:ring-offset-0"
                  style={{ 
                    color: '#112B40',
                    borderColor: '#e2e8f0',
                    '--tw-ring-color': '#23A6F0'
                  } as React.CSSProperties}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#112B40'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4 animate-in slide-in-from-top-2 duration-200" style={{ borderColor: '#e2e8f0' }}>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                link.hasDropdown ? (
                  <div key={link.href} className="space-y-2">
                    <button
                      className="px-3 py-3 text-[16px] font-medium rounded-md transition-colors hover:bg-gray-50 flex items-center justify-between w-full"
                      style={{ color: '#112B40' }}
                      onClick={() => setShowCategoriesDropdown(!showCategoriesDropdown)}
                    >
                      {link.name}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showCategoriesDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    {showCategoriesDropdown && (
                      <div className="mr-4 space-y-1">
                        {categories.map((category) => (
                          <Link
                            key={category.href}
                            href={category.href}
                            className="block px-3 py-2 text-[14px] rounded-md transition-colors hover:bg-gray-50"
                            style={{ color: '#112B40' }}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setShowCategoriesDropdown(false);
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#23A6F0'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#112B40'}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-3 text-[16px] font-medium rounded-md transition-colors hover:bg-gray-50"
                    style={{ color: '#112B40' }}
                    onClick={() => setMobileMenuOpen(false)}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#23A6F0'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#112B40'}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}