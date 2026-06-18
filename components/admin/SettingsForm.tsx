"use client";

import { useState } from "react";
import type { StoreSettingsView } from "@/lib/types";

const whatsappPlaceholders = [
  "{customerName}",
  "{phone}",
  "{address}",
  "{items}",
  "{orderId}",
  "{notes}",
];

const templateExampleAr = `مرحبا وايت هاوس، أود تأكيد هذا الطلب:
رقم الطلب: {orderId}
الاسم: {customerName}
الهاتف: {phone}
العنوان: {address}
{notes}

المنتجات:
{items}`;

const templateExampleEn = `Hello White House, I would like to confirm this order:
Order code: {orderId}
Name: {customerName}
Phone: {phone}
Address: {address}
{notes}

Items:
{items}`;

export function SettingsForm({ settings }: { settings: StoreSettingsView }) {
  const [status, setStatus] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...Object.fromEntries(form.entries()),
        defaultCurrency: "SYP",
      }),
    });
    setStatus(
      response.ok
        ? "تم تحديث الإعدادات."
        : "تعذر التحديث. تأكد من الحقول المطلوبة.",
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <Section title="هوية المتجر">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            name="storeNameAr"
            label="اسم المتجر بالعربية"
            defaultValue={settings.storeNameAr}
            dir="rtl"
            required
          />
          <Field
            name="storeNameEn"
            label="Store name in English"
            defaultValue={settings.storeNameEn}
            dir="ltr"
            required
          />
        </div>
      </Section>

      <Section title="معلومات التواصل">
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            name="whatsappNumber"
            label="رقم واتساب"
            defaultValue={settings.whatsappNumber}
            dir="ltr"
            required
          />
          <Field
            name="supportPhone"
            label="هاتف الدعم"
            defaultValue={settings.supportPhone || ""}
            dir="ltr"
          />
          <Field
            name="supportEmail"
            label="إيميل الدعم"
            type="email"
            defaultValue={settings.supportEmail}
            dir="ltr"
            required
          />
        </div>
      </Section>

      <Section title="روابط التواصل الاجتماعي">
        <div className="grid gap-4 md:grid-cols-3">
          <Field
            name="facebookUrl"
            label="Facebook"
            defaultValue={settings.facebookUrl || ""}
            dir="ltr"
          />
          <Field
            name="instagramUrl"
            label="Instagram"
            defaultValue={settings.instagramUrl || ""}
            dir="ltr"
          />
          <Field
            name="whatsappUrl"
            label="WhatsApp URL"
            defaultValue={settings.whatsappUrl || ""}
            dir="ltr"
          />
        </div>
      </Section>

      <Section title="النصوص والموقع">
        <Textarea
          name="aboutAr"
          label="نص عن المتجر بالعربية"
          defaultValue={settings.aboutAr}
          dir="rtl"
          required
        />
        <Textarea
          name="aboutEn"
          label="About text in English"
          defaultValue={settings.aboutEn}
          dir="ltr"
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            name="locationAr"
            label="الموقع بالعربية"
            defaultValue={settings.locationAr}
            dir="rtl"
            required
          />
          <Field
            name="locationEn"
            label="Location in English"
            defaultValue={settings.locationEn}
            dir="ltr"
            required
          />
        </div>
      </Section>

      <Section title="قوالب رسائل واتساب">
        <div className="rounded-2xl bg-bone p-4">
          <p className="text-sm font-black">
            Use these placeholders in the message:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {whatsappPlaceholders.map((placeholder) => (
              <code
                key={placeholder}
                className="rounded-full bg-paper px-3 py-2 text-xs font-black text-ink"
              >
                {placeholder}
              </code>
            ))}
          </div>
          <p className="mt-3 text-xs font-bold leading-5 text-muted">
            Put each placeholder exactly where that value should appear. Leave a
            template empty to use the built-in default message.
            Prices and order totals are not included in WhatsApp messages.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2" dir="ltr">
          <div className="grid gap-2" dir="ltr">
            <Textarea
              name="whatsappTemplateEn"
              label="WhatsApp template in English"
              defaultValue={settings.whatsappTemplateEn || ""}
              placeholder={templateExampleEn}
              dir="ltr"
              className="min-h-[26rem]"
            />
            <p className="text-xs font-bold leading-5 text-muted">
              Simple English example: edit the words and keep placeholders like{" "}
              {"{items}"} unchanged.
            </p>
          </div>
          <div className="grid gap-2" dir="rtl">
            <Textarea
              name="whatsappTemplateAr"
              label="قالب واتساب بالعربية"
              defaultValue={settings.whatsappTemplateAr || ""}
              placeholder={templateExampleAr}
              dir="rtl"
              className="min-h-[26rem]"
            />
            <p className="text-xs font-bold leading-5 text-muted">
              مثال عربي بسيط: عدل الكلمات واترك الرموز بين الأقواس كما هي.
            </p>
          </div>
        </div>
      </Section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="tap-target rounded-full bg-ink px-7 py-4 font-black text-bone">
          حفظ الإعدادات
        </button>
        {status && <p className="font-bold text-caramel">{status}</p>}
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="premium-card grid gap-4 p-4 sm:p-5">
      <h2 className="text-xl font-black">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>
      <input className="admin-field" {...props} />
    </label>
  );
}

function Textarea({
  label,
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>
      <textarea className={`admin-field min-h-28 ${className}`} {...props} />
    </label>
  );
}
