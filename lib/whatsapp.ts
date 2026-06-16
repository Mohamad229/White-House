import { dictionary } from "./i18n";
import { formatMoney } from "./format";
import type { Locale, StoreSettingsView } from "./types";

type MessageOrder = {
  code: string;
  customerName: string;
  customerPhone: string;
  cityArea: string;
  detailedAddress: string;
  notes?: string | null;
  total: number;
  currency: string;
  items: Array<{
    selectedProductName: string;
    productInternalCode: string;
    selectedColorName: string;
    size: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

export function cleanWhatsAppNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function buildWhatsAppMessage(locale: Locale, order: MessageOrder) {
  const ar = locale === "ar";
  const lines = ar
    ? [
        "مرحبا وايت هاوس، أود تأكيد هذا الطلب:",
        `رقم الطلب: ${order.code}`,
        `الاسم: ${order.customerName}`,
        `الهاتف: ${order.customerPhone}`,
        `المدينة والمنطقة: ${order.cityArea}`,
        `العنوان: ${order.detailedAddress}`,
        order.notes ? `ملاحظات: ${order.notes}` : "",
        "",
        "المنتجات:",
        ...order.items.map(
          (item, index) =>
            `${index + 1}. ${item.selectedProductName} | كود: ${item.productInternalCode} | اللون: ${item.selectedColorName} | المقاس: ${item.size} | الكمية: ${item.quantity} | السعر: ${formatMoney(item.unitPrice, order.currency, locale)} | المجموع: ${formatMoney(item.lineTotal, order.currency, locale)}`
        ),
        "",
        `الإجمالي: ${formatMoney(order.total, order.currency, locale)}`
      ]
    : [
        "Hello White House, I would like to confirm this order:",
        `Order code: ${order.code}`,
        `Name: ${order.customerName}`,
        `Phone: ${order.customerPhone}`,
        `City and area: ${order.cityArea}`,
        `Address: ${order.detailedAddress}`,
        order.notes ? `Notes: ${order.notes}` : "",
        "",
        "Items:",
        ...order.items.map(
          (item, index) =>
            `${index + 1}. ${item.selectedProductName} | Code: ${item.productInternalCode} | Color: ${item.selectedColorName} | Size: ${item.size} | Qty: ${item.quantity} | Unit: ${formatMoney(item.unitPrice, order.currency, locale)} | Line: ${formatMoney(item.lineTotal, order.currency, locale)}`
        ),
        "",
        `${dictionary[locale].total}: ${formatMoney(order.total, order.currency, locale)}`
      ];

  return lines.filter(Boolean).join("\n");
}

export function buildWhatsAppUrl(settings: StoreSettingsView, locale: Locale, order: MessageOrder) {
  const message = buildWhatsAppMessage(locale, order);
  return `https://wa.me/${cleanWhatsAppNumber(settings.whatsappNumber)}?text=${encodeURIComponent(message)}`;
}
