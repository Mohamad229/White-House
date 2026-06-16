"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { dictionary } from "@/lib/i18n";
import { formatMoney } from "@/lib/format";
import type { Locale } from "@/lib/types";
import { itemColor, itemName, useCart } from "./CartProvider";

export function OrderBar() {
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<Locale>("ar");
  const [status, setStatus] = useState<string>("");

  const t = dictionary[locale];
  const currency = cart.items[0]?.currency ?? "SYP";
  const payloadItems = useMemo(
    () =>
      cart.items.map((item) => ({
        productId: item.productId,
        colorId: item.colorId,
        size: item.size,
        quantity: item.quantity
      })),
    [cart.items]
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
      items: payloadItems
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
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
      <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-2xl bg-ink p-3 text-bone shadow-bar md:bottom-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase text-bone/55">{t.orderBar}</p>
            <p className="text-lg font-black">
              {cart.count} · {formatMoney(cart.total, currency, locale)}
            </p>
          </div>
          <button className="tap-target rounded-full bg-bone px-5 py-3 text-sm font-black uppercase text-ink" onClick={() => setOpen(true)}>
            {t.review}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/55 p-3 backdrop-blur-sm">
          <div className="mx-auto my-6 max-w-4xl rounded-2xl bg-paper shadow-[0_24px_80px_rgb(23_22_60/0.28)]" dir={dictionary[locale].dir}>
            <div className="flex items-center justify-between gap-3 border-b border-ink/10 p-5">
              <h2 className="text-2xl font-black">{t.checkout}</h2>
              <div className="flex items-center gap-2">
                <button className="tap-target rounded-full border border-ink/15 px-3 py-2 text-xs font-black" onClick={() => setLocale(locale === "ar" ? "en" : "ar")}>
                  {dictionary[locale].language}
                </button>
                <button className="tap-target rounded-full border border-ink/15 px-3 py-2 text-xs font-black" onClick={() => setOpen(false)}>
                  ×
                </button>
              </div>
            </div>
            <div className="grid gap-6 p-4 sm:p-5 lg:grid-cols-[1fr_0.95fr]">
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.key} className="grid grid-cols-[5.5rem_1fr] gap-4 rounded-2xl bg-bone p-3">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-stonewash">
                      {item.imageUrl && <Image src={item.imageUrl} alt={itemName(item, locale)} fill className="object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-black">{itemName(item, locale)}</h3>
                          <p className="text-sm text-muted">
                            {itemColor(item, locale)} · {item.size}
                          </p>
                        </div>
                        <button className="text-sm font-bold text-caramel" onClick={() => cart.removeItem(item.key)}>
                          {t.remove}
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <input
                          className="field max-w-24"
                          type="number"
                          min={1}
                          max={20}
                          value={item.quantity}
                          onChange={(event) => cart.updateQuantity(item.key, Number(event.target.value))}
                          aria-label={t.quantity}
                        />
                        <strong>{formatMoney(item.unitPrice * item.quantity, item.currency, locale)}</strong>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between border-t border-ink/15 pt-4 text-xl font-black">
                  <span>{t.total}</span>
                  <span>{formatMoney(cart.total, currency, locale)}</span>
                </div>
              </div>
              <form className="space-y-3" onSubmit={submitOrder}>
                <Field label={t.name} name="customerName" required />
                <Field label={t.phone} name="customerPhone" required />
                <Field label={t.cityArea} name="cityArea" required />
                <label className="block">
                  <span className="mb-1 block text-sm font-black">{t.address}</span>
                  <textarea className="field min-h-24" name="detailedAddress" required />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-black">{t.notes}</span>
                  <textarea className="field min-h-20" name="notes" />
                </label>
                {status && <p className="rounded-xl bg-red-100 p-3 text-sm font-bold text-red-800">{status}</p>}
                <button className="tap-target w-full rounded-full bg-ink px-5 py-4 font-black uppercase text-bone" type="submit">
                  {t.submitOrder}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-black">{label}</span>
      <input className="field" {...props} />
    </label>
  );
}
