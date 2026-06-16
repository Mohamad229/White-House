export type Locale = "ar" | "en";

export type CategoryView = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  imageUrl?: string | null;
  isVisible: boolean;
  sortOrder: number;
};

export type ProductColorView = {
  id: string;
  nameAr: string;
  nameEn: string;
  hex: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  sortOrder: number;
  variants: ProductVariantView[];
};

export type ProductVariantView = {
  id: string;
  colorId: string;
  size: string;
  isAvailable: boolean;
};

export type ProductImageView = {
  id: string;
  url: string;
  altAr: string;
  altEn: string;
  isMain: boolean;
  colorId?: string | null;
  sortOrder: number;
};

export type ProductView = {
  id: string;
  categoryId: string;
  slug: string;
  internalCode: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  shortDescriptionAr: string;
  shortDescriptionEn: string;
  price: number;
  currency: string;
  status: "visible" | "hidden" | "outOfStock";
  isFeatured: boolean;
  category?: CategoryView | null;
  images: ProductImageView[];
  colors: ProductColorView[];
};

export type StoreSettingsView = {
  id: string;
  storeNameAr: string;
  storeNameEn: string;
  whatsappNumber: string;
  supportPhone?: string | null;
  supportEmail: string;
  defaultCurrency: string;
  facebookUrl?: string | null;
  whatsappUrl?: string | null;
  instagramUrl?: string | null;
  aboutAr: string;
  aboutEn: string;
  locationAr: string;
  locationEn: string;
  whatsappTemplateAr?: string | null;
  whatsappTemplateEn?: string | null;
};

export type OrderCartInput = {
  productId: string;
  colorId: string;
  size: string;
  quantity: number;
};

export type CheckoutInput = {
  locale: Locale;
  customerName: string;
  customerPhone: string;
  cityArea: string;
  detailedAddress: string;
  notes?: string;
  items: OrderCartInput[];
};
