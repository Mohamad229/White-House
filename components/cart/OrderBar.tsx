"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { dictionary } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import { normalizeImageUrl } from "@/lib/image-url";
import type { Locale } from "@/lib/types";
import { itemColor, itemName, useCart } from "./CartProvider";

function currentLocale(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ar";
}

export function OrderBar() {
  const cart = useCart();
  const pathname = usePathname();
  const detectedLocale = currentLocale(pathname);
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>(detectedLocale);
  const [status, setStatus] = useState<string>("");
  const panelSideClass =
    locale === "en" ? "wh-checkout-panel-left" : "wh-checkout-panel-right";

  const t = dictionary[locale];
  const currency = cart.items[0]?.currency ?? "SYP";
  const payloadItems = useMemo(
    () =>
      cart.items.map((item) => ({
        productId: item.productId,
        colorId: item.colorId,
        size: item.size,
        quantity: item.quantity,
      })),
    [cart.items],
  );

  if (cart.count === 0) return null;

  async function submitOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const form = new FormData(event.currentTarget);
    const body = {
      locale,
      customerName: String(form.get("customerName") || ""),
      customerPhone: String(form.get("customerPhone") || ""),
      cityArea: String(form.get("cityArea") || ""),
      detailedAddress: String(form.get("detailedAddress") || ""),
      notes: String(form.get("notes") || ""),
      items: payloadItems,
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      setStatus(data.error || "Could not save order.");
      return;
    }
    cart.clear();
    window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <>
      <div className="wh-order-fab">
        <div className="container-shell wh-order-fab-inner">
          <div
            className="flex items-center gap-3 text-start"
            dir={dictionary[detectedLocale].dir}
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-full bg-ink text-paper"
              aria-hidden="true"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 7h15l-1.5 9h-12z" />
                <path d="M6 7 5 3H2" />
                <circle cx="9" cy="20" r="1" />
                <circle cx="18" cy="20" r="1" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-black">
                {cart.count} · {t.orderBar}
              </p>
              <p className="text-xs text-muted">
                {t.total}: {formatMoney(cart.total, currency, detectedLocale)}
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setLocale(detectedLocale);
              setOpen(true);
            }}
            type="button"
          >
            {t.review}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[70] bg-ink/55 backdrop-blur-sm"
          dir={dictionary[locale].dir}
        >
          <button
            className="absolute inset-0 h-full w-full cursor-default"
            type="button"
            aria-label={t.close}
            onClick={() => setOpen(false)}
          />
          <aside
            className={`wh-checkout-panel ${panelSideClass} relative flex flex-col overflow-y-auto p-5 shadow-soft md:h-full md:p-6`}
          >
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 pb-4">
              <h2 className="text-3xl font-black tracking-[-0.05em]">
                {t.checkout}
              </h2>
              <div className="flex items-center gap-2">
                {/* <button
                  className="rounded-full border border-ink/15 px-3 py-2 text-xs font-black"
                  type="button"
                  onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
                >
                  {dictionary[locale].language}
                </button> */}
                <button
                  className="wh-icon-button"
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t.close}
                >
                  <span className="relative block h-5 w-5" aria-hidden="true">
                    <span className="absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                    <span className="absolute left-0 top-1/2 block h-0.5 w-5 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-5">
              <div className="grid gap-4">
                {cart.items.map((item) => (
                  <div
                    key={item.key}
                    className="grid grid-cols-[86px_1fr] gap-3 rounded-[22px] bg-brass/10 p-3 text-start"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-stonewash">
                      {normalizeImageUrl(item.imageUrl) && (
                        <Image
                          src={normalizeImageUrl(item.imageUrl)}
                          alt={itemName(item, locale)}
                          fill
                          className="object-cover"
                          sizes="86px"
                        />
                      )}
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-black leading-snug">
                            {itemName(item, locale)}
                          </p>
                          <p className="text-xs text-muted">
                            {itemColor(item, locale)} · {item.size}
                          </p>
                        </div>
                        <button
                          className="text-xs font-black uppercase tracking-[0.12em] text-caramel"
                          type="button"
                          onClick={() => cart.removeItem(item.key)}
                        >
                          {t.remove}
                        </button>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <input
                          className="field h-12 w-20 rounded-2xl text-center"
                          type="number"
                          min={1}
                          max={20}
                          value={item.quantity}
                          aria-label={t.quantity}
                          onChange={(event) =>
                            cart.updateQuantity(
                              item.key,
                              Number(event.target.value),
                            )
                          }
                        />
                        <span className="text-sm font-black">
                          {formatMoney(
                            item.unitPrice * item.quantity,
                            item.currency,
                            locale,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-ink/15 pt-5 text-xl font-black">
                <span>{t.total}</span>
                <span>{formatMoney(cart.total, currency, locale)}</span>
              </div>

              <form className="mt-6 grid gap-3" onSubmit={submitOrder}>
                <Field label={t.name} name="customerName" required />
                <Field
                  label={t.phone}
                  name="customerPhone"
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  required
                />
                <Field label={t.cityArea} name="cityArea" required />
                <label className="field-label">
                  {t.address}
                  <textarea
                    className="field min-h-24"
                    name="detailedAddress"
                    required
                  />
                </label>
                <label className="field-label">
                  {t.notes}
                  <textarea className="field min-h-20" name="notes" />
                </label>
                {status && (
                  <p className="rounded-xl bg-red-100 p-3 text-sm font-bold text-red-800">
                    {status}
                  </p>
                )}
                <button className="btn btn-primary w-full" type="submit">
                  {t.submitOrder}
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="field-label">
      {label}
      <input className="field" {...props} />
    </label>
  );
}
