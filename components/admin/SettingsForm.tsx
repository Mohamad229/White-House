"use client";

import { useState } from "react";
import type { StoreSettingsView } from "@/lib/types";

export function SettingsForm({ settings }: { settings: StoreSettingsView }) {
  const [status, setStatus] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...Object.fromEntries(form.entries()), defaultCurrency: "SYP" })
    });
    setStatus(response.ok ? "تم تحديث الإعدادات." : "تعذر التحديث. تأكد من الحقول المطلوبة.");
  }

  return (
    <form onSubmit={submit} className="grid gap-5">
      <Section title="هوية المتجر">
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="storeNameAr" label="اسم المتجر بالعربية" defaultValue={settings.storeNameAr} required />
          <Field name="storeNameEn" label="اسم المتجر بالإنجليزية" defaultValue={settings.storeNameEn} required />
        </div>
      </Section>

      <Section title="معلومات التواصل">
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="whatsappNumber" label="رقم واتساب" defaultValue={settings.whatsappNumber} required />
          <Field name="supportPhone" label="هاتف الدعم" defaultValue={settings.supportPhone || ""} />
          <Field name="supportEmail" label="إيميل الدعم" type="email" defaultValue={settings.supportEmail} required />
        </div>
      </Section>

      <Section title="روابط التواصل الاجتماعي">
        <div className="grid gap-4 md:grid-cols-3">
          <Field name="facebookUrl" label="Facebook" defaultValue={settings.facebookUrl || ""} />
          <Field name="instagramUrl" label="Instagram" defaultValue={settings.instagramUrl || ""} />
          <Field name="whatsappUrl" label="WhatsApp URL" defaultValue={settings.whatsappUrl || ""} />
        </div>
      </Section>

      <Section title="النصوص والموقع">
        <Textarea name="aboutAr" label="نص عن المتجر بالعربية" defaultValue={settings.aboutAr} required />
        <Textarea name="aboutEn" label="About text in English" defaultValue={settings.aboutEn} required />
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="locationAr" label="الموقع بالعربية" defaultValue={settings.locationAr} required />
          <Field name="locationEn" label="Location in English" defaultValue={settings.locationEn} required />
        </div>
      </Section>

      <Section title="قوالب رسائل واتساب">
        <Textarea name="whatsappTemplateAr" label="قالب واتساب بالعربية" defaultValue={settings.whatsappTemplateAr || ""} />
        <Textarea name="whatsappTemplateEn" label="WhatsApp template in English" defaultValue={settings.whatsappTemplateEn || ""} />
      </Section>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="tap-target rounded-full bg-ink px-7 py-4 font-black text-bone">حفظ الإعدادات</button>
        {status && <p className="font-bold text-caramel">{status}</p>}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="premium-card grid gap-4 p-4 sm:p-5">
      <h2 className="text-xl font-black">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>
      <input className="admin-field" {...props} />
    </label>
  );
}

function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>
      <textarea className="admin-field min-h-28" {...props} />
    </label>
  );
}
