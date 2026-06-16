import type { CategoryView, ProductView, StoreSettingsView } from "./types";

export const seedSettings: StoreSettingsView = {
  id: "seed-settings",
  storeNameAr: "وايت هاوس",
  storeNameEn: "White House",
  whatsappNumber: "963900000000",
  supportPhone: "963900000000",
  supportEmail: "support@whitehouse.example",
  defaultCurrency: "SYP",
  facebookUrl: "https://facebook.com",
  whatsappUrl: "https://wa.me/963900000000",
  instagramUrl: "https://instagram.com",
  aboutAr: "وايت هاوس يقدم أساسيات رجالية يومية بقصات نظيفة، ألوان هادئة، وخامات تناسب حياة المدينة.",
  aboutEn: "White House edits everyday menswear into clean silhouettes, quiet colors, and city-ready essentials.",
  locationAr: "دمشق، سوريا. التوصيل والتفاصيل النهائية عبر واتساب.",
  locationEn: "Damascus, Syria. Delivery details are confirmed through WhatsApp.",
  whatsappTemplateAr: "",
  whatsappTemplateEn: ""
};

export const seedCategories: CategoryView[] = [
  {
    id: "cat-tshirts",
    slug: "t-shirts",
    nameAr: "تي شيرت",
    nameEn: "T-Shirts",
    descriptionAr: "قطع يومية خفيفة بقصات مستقيمة وألوان أساسية.",
    descriptionEn: "Daily lightweight pieces with straight cuts and essential colors.",
    imageUrl: "/brand/shirt-stone.png",
    isVisible: true,
    sortOrder: 1
  },
  {
    id: "cat-hoodies",
    slug: "hoodies",
    nameAr: "هوديز",
    nameEn: "Hoodies",
    descriptionAr: "طبقات دافئة بتفاصيل نظيفة وملمس فاخر.",
    descriptionEn: "Warm layers with clean details and a premium hand feel.",
    imageUrl: "/brand/hoodie-cream.png",
    isVisible: true,
    sortOrder: 2
  },
  {
    id: "cat-jackets",
    slug: "jackets",
    nameAr: "جاكيت",
    nameEn: "Jackets",
    descriptionAr: "قطع خارجية عملية بلون داكن وحضور قوي.",
    descriptionEn: "Functional outerwear with dark tones and a strong profile.",
    imageUrl: "/brand/jacket-ink.png",
    isVisible: true,
    sortOrder: 3
  }
];

export const seedProducts: ProductView[] = [
  {
    id: "prod-stone-tee",
    categoryId: "cat-tshirts",
    slug: "stone-relaxed-tee",
    internalCode: "WH-TEE-001",
    nameAr: "تي شيرت ستون بقصة مريحة",
    nameEn: "Stone Relaxed Tee",
    descriptionAr: "تي شيرت قطني متوسط الوزن بقصة مريحة، مناسب للارتداء اليومي والطبقات الخفيفة.",
    descriptionEn: "A mid-weight cotton tee with a relaxed profile, made for daily wear and easy layering.",
    shortDescriptionAr: "قطن متوسط الوزن بقصة مريحة.",
    shortDescriptionEn: "Mid-weight cotton with a relaxed profile.",
    price: 185000,
    currency: "SYP",
    status: "visible",
    isFeatured: true,
    category: seedCategories[0],
    images: [
      { id: "img-stone", url: "/brand/shirt-stone.png", altAr: "تي شيرت ستون", altEn: "Stone tee", isMain: true, colorId: "color-stone", sortOrder: 1 },
      { id: "img-charcoal", url: "/brand/shirt-charcoal.png", altAr: "تي شيرت فحمي", altEn: "Charcoal tee", isMain: false, colorId: "color-charcoal", sortOrder: 2 }
    ],
    colors: [
      {
        id: "color-stone",
        nameAr: "ستون",
        nameEn: "Stone",
        hex: "#eee9dd",
        imageUrl: "/brand/shirt-stone.png",
        isAvailable: true,
        sortOrder: 1,
        variants: ["S", "M", "L", "XL"].map((size) => ({ id: `v-stone-${size}`, colorId: "color-stone", size, isAvailable: true }))
      },
      {
        id: "color-charcoal",
        nameAr: "فحمي",
        nameEn: "Charcoal",
        hex: "#282824",
        imageUrl: "/brand/shirt-charcoal.png",
        isAvailable: true,
        sortOrder: 2,
        variants: ["M", "L"].map((size) => ({ id: `v-charcoal-${size}`, colorId: "color-charcoal", size, isAvailable: true }))
      }
    ]
  },
  {
    id: "prod-hoodie",
    categoryId: "cat-hoodies",
    slug: "cream-weight-hoodie",
    internalCode: "WH-HOD-014",
    nameAr: "هودي كريمي ثقيل",
    nameEn: "Cream Weight Hoodie",
    descriptionAr: "هودي ناعم بلون كريمي، جيب أمامي، وقصة متوازنة للأيام الباردة.",
    descriptionEn: "A soft cream hoodie with a front pocket and balanced fit for cooler days.",
    shortDescriptionAr: "هودي ناعم بلون كريمي فاخر.",
    shortDescriptionEn: "Soft cream hoodie with a premium finish.",
    price: 315000,
    currency: "SYP",
    status: "visible",
    isFeatured: true,
    category: seedCategories[1],
    images: [{ id: "img-hoodie", url: "/brand/hoodie-cream.png", altAr: "هودي كريمي", altEn: "Cream hoodie", isMain: true, colorId: "color-cream", sortOrder: 1 }],
    colors: [
      {
        id: "color-cream",
        nameAr: "كريمي",
        nameEn: "Cream",
        hex: "#e5d8c0",
        imageUrl: "/brand/hoodie-cream.png",
        isAvailable: true,
        sortOrder: 1,
        variants: ["M", "L", "XL"].map((size) => ({ id: `v-cream-${size}`, colorId: "color-cream", size, isAvailable: true }))
      }
    ]
  },
  {
    id: "prod-olive",
    categoryId: "cat-tshirts",
    slug: "olive-city-tee",
    internalCode: "WH-TEE-009",
    nameAr: "تي شيرت أوليف",
    nameEn: "Olive City Tee",
    descriptionAr: "تي شيرت بلون زيتوني مطفي، مناسب للتنسيق مع الدنيم والجاكيتات.",
    descriptionEn: "A muted olive tee that works cleanly with denim and light jackets.",
    shortDescriptionAr: "لون زيتوني مطفي وحضور يومي.",
    shortDescriptionEn: "Muted olive tone with everyday presence.",
    price: 175000,
    currency: "SYP",
    status: "visible",
    isFeatured: false,
    category: seedCategories[0],
    images: [{ id: "img-olive", url: "/brand/shirt-olive.png", altAr: "تي شيرت أوليف", altEn: "Olive tee", isMain: true, colorId: "color-olive", sortOrder: 1 }],
    colors: [
      {
        id: "color-olive",
        nameAr: "زيتوني",
        nameEn: "Olive",
        hex: "#6b6b54",
        imageUrl: "/brand/shirt-olive.png",
        isAvailable: true,
        sortOrder: 1,
        variants: ["S", "M", "L"].map((size) => ({ id: `v-olive-${size}`, colorId: "color-olive", size, isAvailable: true }))
      }
    ]
  },
  {
    id: "prod-jacket",
    categoryId: "cat-jackets",
    slug: "ink-light-jacket",
    internalCode: "WH-JKT-003",
    nameAr: "جاكيت إنك خفيف",
    nameEn: "Ink Light Jacket",
    descriptionAr: "جاكيت خفيف بلون أزرق داكن مع تفاصيل بسيطة للمدينة.",
    descriptionEn: "A lightweight dark blue jacket with clean city details.",
    shortDescriptionAr: "جاكيت خفيف بتفاصيل مدينة.",
    shortDescriptionEn: "Light jacket with city-ready details.",
    price: 420000,
    currency: "SYP",
    status: "visible",
    isFeatured: true,
    category: seedCategories[2],
    images: [{ id: "img-jacket", url: "/brand/jacket-ink.png", altAr: "جاكيت إنك", altEn: "Ink jacket", isMain: true, colorId: "color-ink", sortOrder: 1 }],
    colors: [
      {
        id: "color-ink",
        nameAr: "أزرق داكن",
        nameEn: "Ink",
        hex: "#17163c",
        imageUrl: "/brand/jacket-ink.png",
        isAvailable: true,
        sortOrder: 1,
        variants: ["M", "L", "XL"].map((size) => ({ id: `v-ink-${size}`, colorId: "color-ink", size, isAvailable: true }))
      }
    ]
  }
];
