import type { Locale } from "./types";

export const dictionary = {
  ar: {
    dir: "rtl",
    home: "الرئيسية",
    categories: "الأقسام",
    products: "المنتجات",
    about: "عن المتجر",
    language: "English",
    menu: "القائمة",
    close: "إغلاق",

    heroTop: "أزياء رجالية مختارة",
    heroBlack: "جهّز إطلالتك",
    heroWhite: "بالقطع الصحيحة",
    heroSub:
      "قطع رجالية يومية بهوية هادئة، خامات مريحة، ألوان دقيقة، وطلب سريع عبر واتساب.",
    heroCta: "تسوّق المجموعة",
    secondaryCta: "استكشف الأقسام",

    newest: "مختارات جديدة",
    newestLight: "من كل قسم",
    categoryHint: "منتج مختار من هذا القسم. افتح القسم لمشاهدة جميع المنتجات.",
    viewCategory: "عرض القسم",
    viewAll: "عرض الكل",
    addToOrder: "أضف إلى الطلب",
    details: "عرض التفاصيل",
    filters: "تصفية حسب القسم",
    all: "الكل",
    size: "المقاس",
    color: "اللون",
    quantity: "الكمية",
    aboutProduct: "عن المنتج",
    relatedProducts: "منتجات من نفس القسم",

    orderBar: "طلبك",
    review: "مراجعة الطلب",
    checkout: "إكمال الطلب",
    total: "الإجمالي",
    empty: "لا توجد منتجات متاحة حاليًا.",
    name: "الاسم الكامل",
    phone: "رقم الهاتف",
    cityArea: "المدينة والمنطقة",
    address: "العنوان التفصيلي",
    notes: "ملاحظات اختيارية",
    submitOrder: "حفظ الطلب وفتح واتساب",
    continueShopping: "متابعة التسوق",
    remove: "حذف",

    support: "الدعم",
    social: "التواصل الاجتماعي",
    usefulLinks: "روابط مفيدة",
    contact: "تواصل معنا",
    marquee: "وايت هاوس ستور",
  },
  en: {
    dir: "ltr",
    home: "Home",
    categories: "Categories",
    products: "Products",
    about: "About the Store",
    language: "العربية",
    menu: "Menu",
    close: "Close",

    heroTop: "Curated Menswear",
    heroBlack: "Build Your Look",
    heroWhite: "With The Right Pieces",
    heroSub:
      "Quiet everyday menswear, comfortable fabrics, precise colors, and a fast WhatsApp order flow.",
    heroCta: "Shop the Collection",
    secondaryCta: "Browse Categories",

    newest: "New Picks",
    newestLight: "From Each Category",
    categoryHint: "A selected product from this category. Open the category to view the full range.",
    viewCategory: "View Category",
    viewAll: "View All",
    addToOrder: "Add to Order",
    details: "View Details",
    filters: "Filter by Category",
    all: "All",
    size: "Size",
    color: "Color",
    quantity: "Quantity",
    aboutProduct: "About the Product",
    relatedProducts: "More from This Category",

    orderBar: "Your Order",
    review: "Review Order",
    checkout: "Checkout",
    total: "Total",
    empty: "No products are available right now.",
    name: "Full Name",
    phone: "Phone Number",
    cityArea: "City and Area",
    address: "Full Address",
    notes: "Optional Notes",
    submitOrder: "Save Order and Open WhatsApp",
    continueShopping: "Continue Shopping",
    remove: "Remove",

    support: "Support",
    social: "Social Media",
    usefulLinks: "Useful Links",
    contact: "Contact Us",
    marquee: "White House Store",
  },
} as const;

export function textByLocale(locale: Locale, ar: string, en: string) {
  return locale === "ar" ? ar : en;
}

export function localPath(locale: Locale, path: string) {
  if (locale === "ar") return path || "/";
  if (!path || path === "/") return "/en";
  return `/en${path}`;
}
