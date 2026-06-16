import { z } from "zod";
import { prisma } from "./prisma";
import { getStoreSettings } from "./data";
import { buildWhatsAppUrl } from "./whatsapp";
import { textByLocale } from "./i18n";

const checkoutSchema = z.object({
  locale: z.enum(["ar", "en"]),
  customerName: z.string().trim().min(2),
  customerPhone: z.string().trim().min(7),
  cityArea: z.string().trim().min(2),
  detailedAddress: z.string().trim().min(5),
  notes: z.string().trim().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        colorId: z.string().min(1),
        size: z.string().min(1),
        quantity: z.number().int().min(1).max(20)
      })
    )
    .min(1)
});

function orderCode() {
  const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  return `WH-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export async function createOrder(input: unknown) {
  const parsed = checkoutSchema.parse(input);
  const ids = parsed.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: ids }, status: "visible" },
    include: {
      images: true,
      colors: { include: { variants: true } },
      category: true
    }
  });

  const items = parsed.items.map((cartItem) => {
    const product = products.find((candidate) => candidate.id === cartItem.productId);
    if (!product) throw new Error("Product is not available.");
    const color = product.colors.find((candidate) => candidate.id === cartItem.colorId && candidate.isAvailable);
    if (!color) throw new Error("Selected color is not available.");
    const variant = color.variants.find(
      (candidate) => candidate.size === cartItem.size && candidate.isAvailable
    );
    if (!variant) throw new Error("Selected size is not available.");
    const lineTotal = product.price * cartItem.quantity;
    const image = color.imageUrl || product.images.find((candidate) => candidate.isMain)?.url || product.images[0]?.url;
    return {
      productId: product.id,
      productSlug: product.slug,
      productInternalCode: product.internalCode,
      productNameAr: product.nameAr,
      productNameEn: product.nameEn,
      selectedProductName: textByLocale(parsed.locale, product.nameAr, product.nameEn),
      colorAr: color.nameAr,
      colorEn: color.nameEn,
      selectedColorName: textByLocale(parsed.locale, color.nameAr, color.nameEn),
      colorHex: color.hex,
      size: cartItem.size,
      quantity: cartItem.quantity,
      unitPrice: product.price,
      lineTotal,
      currency: product.currency,
      imageUrl: image
    };
  });

  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const settings = await getStoreSettings();
  const order = await prisma.order.create({
    data: {
      code: orderCode(),
      locale: parsed.locale,
      customerName: parsed.customerName,
      customerPhone: parsed.customerPhone,
      cityArea: parsed.cityArea,
      detailedAddress: parsed.detailedAddress,
      notes: parsed.notes,
      subtotal: total,
      total,
      currency: settings.defaultCurrency,
      whatsappOpenedAt: new Date(),
      items: { create: items }
    },
    include: { items: true }
  });

  return {
    order,
    whatsappUrl: buildWhatsAppUrl(settings, parsed.locale, {
      ...order,
      items: order.items
    })
  };
}
