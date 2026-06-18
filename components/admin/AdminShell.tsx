"use client";

import Link from "next/link";
import { createContext, useContext, useState } from "react";
import { BrandMark } from "../BrandMark";

type AdminLocale = "ar" | "en";

const adminText = {
  ar: {
    dir: "rtl",
    lang: "ar",
    menu: "القائمة",
    close: "إغلاق",
    language: "English",
    eyebrow: "White House Admin",
    description:
      "إدارة وايت هاوس: منتجات، أقسام، طلبات، وإعدادات بواجهة بسيطة لفريق المتجر.",
    logout: "تسجيل الخروج",
    titles: {
      dashboard: "لوحة التحكم",
      products: "المنتجات",
      categories: "الأقسام",
      orders: "الطلبات",
      settings: "الإعدادات",
      newProduct: "منتج جديد",
      editProduct: "تعديل المنتج",
    },
  },
  en: {
    dir: "ltr",
    lang: "en",
    menu: "Menu",
    close: "Close",
    language: "العربية",
    eyebrow: "White House Admin",
    description:
      "Manage White House products, categories, orders, and settings from a focused store dashboard.",
    logout: "Log out",
    titles: {
      dashboard: "Dashboard",
      products: "Products",
      categories: "Categories",
      orders: "Orders",
      settings: "Settings",
      newProduct: "New product",
      editProduct: "Edit product",
    },
  },
} as const;

const nav = [
  { href: "/admin", key: "dashboard" },
  { href: "/admin/products", key: "products" },
  { href: "/admin/categories", key: "categories" },
  { href: "/admin/orders", key: "orders" },
  { href: "/admin/settings", key: "settings" },
] as const;

const AdminLocaleContext = createContext<AdminLocale>("ar");

function translateAdminTitle(title: string, locale: AdminLocale) {
  const titles = adminText[locale].titles;
  const known: Record<string, string> = {
    "لوحة التحكم": titles.dashboard,
    المنتجات: titles.products,
    الأقسام: titles.categories,
    الطلبات: titles.orders,
    الإعدادات: titles.settings,
    "منتج جديد": titles.newProduct,
    "تعديل المنتج": titles.editProduct,
  };

  if (known[title]) return known[title];
  if (title.startsWith("طلب "))
    return locale === "ar" ? title : `Order ${title.replace("طلب ", "")}`;
  return title;
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span className="relative h-4 w-5" aria-hidden="true">
      <span
        className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current transition duration-300 ease-[var(--ease-out)] ${
          open ? "translate-y-[7px] rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-[7px] h-0.5 w-5 rounded-full bg-current transition duration-200 ease-[var(--ease-out)] ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 top-[14px] h-0.5 w-5 rounded-full bg-current transition duration-300 ease-[var(--ease-out)] ${
          open ? "-translate-y-[7px] -rotate-45" : ""
        }`}
      />
    </span>
  );
}

function AdminLanguageButton({
  locale,
  onToggle,
  className = "",
}: {
  locale: AdminLocale;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={`tap-target rounded-full border border-current/15 px-4 py-2 text-xs font-black uppercase transition hover:border-brass hover:text-brass ${className}`}
      onClick={onToggle}
    >
      {adminText[locale].language}
    </button>
  );
}

function AdminNavLink({
  href,
  label,
  open,
  index,
  onClick,
}: {
  href: string;
  label: string;
  open: boolean;
  index: number;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      className={`tap-target rounded-xl border border-bone/10 px-4 py-3 text-sm font-black transition duration-300 hover:border-brass hover:text-brass lg:translate-y-0 lg:opacity-100 ${
        open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
      style={{ transitionDelay: open ? `${index * 35}ms` : "0ms" }}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}

function AdminLogoutButton({
  label,
  open,
  index,
}: {
  label: string;
  open: boolean;
  index: number;
}) {
  return (
    <form
      action="/api/admin/logout"
      method="post"
      className={`transition duration-300 lg:translate-y-0 lg:opacity-100 ${
        open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      }`}
      style={{ transitionDelay: open ? `${index * 35}ms` : "0ms" }}
    >
      <button className="tap-target w-full rounded-xl border border-bone/10 px-4 py-3 text-start text-sm font-black transition hover:border-brass hover:text-brass">
        {label}
      </button>
    </form>
  );
}

function AdminSidebar({
  locale,
  open,
  onMenuToggle,
  onLanguageToggle,
  onNavigate,
}: {
  locale: AdminLocale;
  open: boolean;
  onMenuToggle: () => void;
  onLanguageToggle: () => void;
  onNavigate: () => void;
}) {
  const t = adminText[locale];
  const sideClass = locale === "ar" ? "lg:right-0" : "lg:left-0";

  return (
    <aside
      className={`fixed inset-x-0 top-0 z-50 border-b border-bone/10 bg-ink text-bone shadow-[0_20px_60px_rgb(23_22_60/0.18)] lg:inset-y-0 lg:w-72 lg:border-b-0 ${sideClass}`}
    >
      <div className="flex items-center justify-between gap-4 p-4 lg:block lg:p-6">
        <BrandMark inverse titleVariant="admin" />
        <button
          type="button"
          className="tap-target grid h-11 w-11 place-items-center rounded-full border border-bone/15 text-bone transition hover:border-brass hover:text-brass lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-admin-navigation"
          aria-label={open ? t.close : t.menu}
          onClick={onMenuToggle}
        >
          <MenuGlyph open={open} />
        </button>
        <div className="hidden lg:block">
          <p className="mt-5 text-sm leading-7 text-bone/60">{t.description}</p>
          {/* <AdminLanguageButton
            locale={locale}
            onToggle={onLanguageToggle}
            className="mt-5"
          /> */}
        </div>
      </div>
      <nav
        id="mobile-admin-navigation"
        className={`grid overflow-hidden px-4 transition-all duration-300 ease-[var(--ease-out)] lg:max-h-none lg:gap-2 lg:overflow-visible lg:px-5 lg:pb-5 lg:opacity-100 ${
          open
            ? "max-h-[30rem] gap-2 pb-4 opacity-100"
            : "max-h-0 gap-0 pb-0 opacity-0"
        }`}
      >
        {nav.map((item, index) => (
          <AdminNavLink
            key={item.href}
            href={item.href}
            label={t.titles[item.key]}
            open={open}
            index={index}
            onClick={onNavigate}
          />
        ))}
        {/* <AdminLanguageButton
          locale={locale}
          onToggle={onLanguageToggle}
          className={`text-bone transition duration-300 lg:hidden ${
            open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
        /> */}
        <AdminLogoutButton
          label={t.logout}
          open={open}
          index={nav.length + 1}
        />
      </nav>
    </aside>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [locale, setLocale] = useState<AdminLocale>("ar");
  const t = adminText[locale];
  const mainOffset = locale === "ar" ? "lg:mr-72" : "lg:ml-72";

  return (
    <AdminLocaleContext.Provider value={locale}>
      <div className="min-h-screen bg-bone" dir={t.dir} lang={t.lang}>
        <AdminSidebar
          locale={locale}
          open={open}
          onMenuToggle={() => setOpen((value) => !value)}
          onLanguageToggle={() =>
            setLocale((value) => (value === "ar" ? "en" : "ar"))
          }
          onNavigate={() => setOpen(false)}
        />
        <div className="h-[4.75rem] lg:hidden" aria-hidden="true" />
        <main className={`min-w-0 p-4 sm:p-5 lg:p-8 xl:p-10 ${mainOffset}`}>
          {children}
        </main>
      </div>
    </AdminLocaleContext.Provider>
  );
}

export function AdminHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  const locale = useContext(AdminLocaleContext);
  const t = adminText[locale];

  return (
    <div className="mb-7 flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-caramel">
          {t.eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">
          {translateAdminTitle(title, locale)}
        </h1>
      </div>
      {action}
    </div>
  );
}
