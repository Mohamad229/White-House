"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { dictionary, localPath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { BrandMark } from "./BrandMark";

function switchLocaleHref(locale: Locale, pathname: string) {
  if (locale === "ar") {
    if (!pathname || pathname === "/") return "/en";
    return `/en${pathname}`;
  }
  if (pathname === "/en") return "/";
  return pathname.replace(/^\/en/, "") || "/";
}

export function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = dictionary[locale];
  const switchHref = switchLocaleHref(locale, pathname);
  const links = [
    { href: localPath(locale, "/"), label: t.home },
    { href: localPath(locale, "/#categories"), label: t.categories },
    { href: localPath(locale, "/products"), label: t.products },
    { href: localPath(locale, "/#about"), label: t.about },
  ];

  return (
    <>
      <header className="wh-header" dir={t.dir}>
        <div className="container-shell flex h-16 items-center justify-between gap-3 md:h-[4.85rem]">
          <Link
            href={localPath(locale, "/")}
            className="flex min-w-0 items-center gap-3"
            aria-label="White House home"
            onClick={() => setOpen(false)}
          >
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-7 text-[0.72rem] font-black uppercase tracking-[0.08em] text-ink/70 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              className="hidden rounded-full border border-ink/10 bg-paper px-4 py-3 text-[0.68rem] font-black uppercase text-ink transition hover:border-ink md:inline-flex"
              href={switchHref}
              onClick={() => setOpen(false)}
            >
              {t.language}
            </Link>
            <button
              className="wh-icon-button md:hidden"
              type="button"
              aria-expanded={open}
              aria-controls="public-menu"
              aria-label={open ? t.close : t.menu}
              onClick={() => setOpen(true)}
            >
              <span className="grid gap-1" aria-hidden="true">
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
                <span className="block h-0.5 w-5 rounded-full bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="public-menu"
          className="wh-menu-panel fixed inset-0 z-[60] overflow-y-auto p-4 md:p-6"
          dir={t.dir}
        >
          <div className="flex items-center justify-between gap-4">
            <Link
              href={localPath(locale, "/")}
              className="flex items-center gap-3"
              onClick={() => setOpen(false)}
            >
              <BrandMark />
            </Link>
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

          <div className="container-shell grid gap-8 py-10 md:grid-cols-[1fr_0.7fr] md:items-stretch md:py-14">
            <nav className="grid gap-3">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="wh-menu-link flex items-center justify-between gap-4"
                >
                  <span>{link.label}</span>
                  <span className="text-xs text-caramel">0{index + 1}.</span>
                </Link>
              ))}
              <Link
                href={switchHref}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-ink/10 bg-paper px-5 py-4 text-sm font-black uppercase transition hover:bg-bone"
              >
                {t.language}
              </Link>
            </nav>

            <div className="relative hidden min-h-[34rem] overflow-hidden rounded-[28px] bg-ink md:block">
              <Image
                src="/brand/category-image-3.jpg"
                alt="White House menu visual"
                fill
                className="object-cover opacity-70"
                sizes="40vw"
              />
              <div className="absolute inset-0 bg-ink/45" />
              <div className="absolute inset-x-8 bottom-8 text-paper">
                <span className="mb-6 inline-flex rounded-lg bg-paper/92 p-2">
                  <BrandMark compact />
                </span>
                <p className="max-w-sm text-4xl font-semibold leading-tight">
                  {locale === "ar"
                    ? "تصفح القطع والأقسام بهوية وايت هاوس."
                    : "Explore White House pieces and categories."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-16 md:h-[4.85rem]" aria-hidden="true" />
    </>
  );
}
