"use client";

import { useState } from "react";
import { BrandMark } from "../BrandMark";

export function LoginForm() {
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: String(form.get("username") || ""),
        password: String(form.get("password") || "")
      })
    });
    if (!response.ok) {
      setError("بيانات الدخول غير صحيحة.");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <form onSubmit={submit} className="premium-card mx-auto w-full max-w-md p-6">
      <BrandMark />
      <h1 className="mt-8 text-3xl font-black">دخول الإدارة</h1>
      <p className="mt-2 text-sm leading-7 text-muted">
        استخدم حساب المتجر لإدارة المنتجات والأقسام والطلبات والإعدادات.
      </p>
      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-black">اسم المستخدم</span>
        <input className="admin-field" name="username" required defaultValue="admin" />
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-black">كلمة المرور</span>
        <input className="admin-field" name="password" type="password" required />
      </label>
      {error && <p className="mt-4 rounded-xl bg-red-100 p-3 text-sm font-bold text-red-800">{error}</p>}
      <button className="tap-target mt-6 w-full rounded-full bg-ink px-5 py-3 font-black text-bone">دخول</button>
    </form>
  );
}
