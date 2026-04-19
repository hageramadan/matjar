import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">عن المتجر</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              متجر إلكتروني يوفر أفضل المنتجات بأسعار منافسة وجودة عالية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  الفئات
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  تواصل معنا
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">معلومات الاتصال</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <MdPhone className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">+966 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <MdEmail className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">info@matjari.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MdLocationOn className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">الرياض، المملكة العربية السعودية</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">تابعنا</h3>
            <div className="flex gap-4">
              <Link 
                href="#" 
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-[#1877f2] hover:text-white transition-colors"
              >
                <FaFacebook className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-[#1da1f2] hover:text-white transition-colors"
              >
                <FaTwitter className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-[#e4405f] hover:text-white transition-colors"
              >
                <FaInstagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} متجري. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}