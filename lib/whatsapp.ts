import type { Locale, StoreSettingsView } from "./types";

type MessageOrder = {
  code: string;
  customerName: string;
  customerPhone: string;
  cityArea: string;
  detailedAddress: string;
  notes?: string | null;
  items: Array<{
    selectedProductName: string;
    productInternalCode: string;
    selectedColorName: string;
    size: string;
    quantity: number;
  }>;
};

const fallbackTemplates = {
  ar: [
    "مرحبا وايت هاوس، أود تأكيد هذا الطلب:",
    "رقم الطلب: {orderId}",
    "الاسم: {customerName}",
    "الهاتف: {phone}",
    "العنوان: {address}",
    "{notes}",
    "",
    "المنتجات:",
    "{items}",
  ].join("\n"),
  en: [
    "Hello White House, I would like to confirm this order:",
    "Order code: {orderId}",
    "Name: {customerName}",
    "Phone: {phone}",
    "Address: {address}",
    "{notes}",
    "",
    "Items:",
    "{items}",
  ].join("\n"),
} as const;

export function cleanWhatsAppNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

function formatItems(locale: Locale, order: MessageOrder) {
  const ar = locale === "ar";
  return order.items
    .map((item, index) =>
      ar
        ? `${index + 1}. ${item.selectedProductName} | كود: ${item.productInternalCode} | اللون: ${item.selectedColorName} | المقاس: ${item.size} | الكمية: ${item.quantity}`
        : `${index + 1}. ${item.selectedProductName} | Code: ${item.productInternalCode} | Color: ${item.selectedColorName} | Size: ${item.size} | Qty: ${item.quantity}`,
    )
    .join("\n");
}

function removePricePlaceholders(template: string) {
  return template
    .split("\n")
    .filter((line) => !/\{total\}/.test(line))
    .join("\n");
}

export function buildWhatsAppMessage(
  settings: StoreSettingsView,
  locale: Locale,
  order: MessageOrder,
) {
  const template =
    (locale === "ar"
      ? settings.whatsappTemplateAr
      : settings.whatsappTemplateEn
    )?.trim() || fallbackTemplates[locale];
  const safeTemplate = removePricePlaceholders(template);
  const address = [order.cityArea, order.detailedAddress]
    .filter(Boolean)
    .join(" - ");
  const notes = order.notes
    ? locale === "ar"
      ? `ملاحظات: ${order.notes}`
      : `Notes: ${order.notes}`
    : "";
  const replacements: Record<string, string> = {
    customerName: order.customerName,
    phone: order.customerPhone,
    address,
    items: formatItems(locale, order),
    orderId: order.code,
    notes,
  };

  return safeTemplate
    .replace(
      /\{(customerName|phone|address|items|orderId|notes)\}/g,
      (_, key: string) => replacements[key] ?? "",
    )
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n");
}

export function buildWhatsAppUrl(
  settings: StoreSettingsView,
  locale: Locale,
  order: MessageOrder,
) {
  const message = buildWhatsAppMessage(settings, locale, order);
  return `https://wa.me/${cleanWhatsAppNumber(settings.whatsappNumber)}?text=${encodeURIComponent(message)}`;
}
