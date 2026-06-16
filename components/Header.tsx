"use client";

import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "./BrandMark";
import { dictionary, localPath } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = dictionary[locale];
  const switchHref = locale === "ar" ? "/en" : "/";
  const links = [
    { href: localPath(locale, "/"), label: t.home },
    { href: localPath(locale, "/#categories"), label: t.categories },
    { href: localPath(locale, "/products"), label: t.products },
    { href: localPath(locale, "/#about"), label: t.about }
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/95 shadow-[0_12px_40px_rgb(23_22_60/0.09)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[118rem] items-center justify-between gap-3 px-4 py-3 md:px-8 lg:px-12 lg:py-4">
          <Link
            href={localPath(locale, "/")}
            aria-label="White House home"
            className="min-w-0 shrink-0"
            onClick={() => setOpen(false)}
          >
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-7 text-[0.78rem] font-black uppercase text-ink/85 md:flex lg:gap-9">
            {links.map((link) => (
              <Link key={link.href} className="transition hover:text-caramel" href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              className="tap-target hidden items-center justify-center rounded-full border border-ink/10 bg-bone px-4 py-2 text-[0.72rem] font-black uppercase text-ink shadow-sm transition hover:border-caramel md:inline-flex"
              href={switchHref}
              onClick={() => setOpen(false)}
            >
              {t.language}
            </Link>
            <button
              className="tap-target grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-ink text-bone shadow-sm transition hover:bg-caramel md:hidden"
              type="button"
              aria-expanded={open}
              aria-controls="mobile-public-navigation"
              aria-label={open ? t.close : t.menu}
              onClick={() => setOpen((value) => !value)}
            >
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
            </button>
          </div>
        </div>

        <nav
          id="mobile-public-navigation"
          className={`grid overflow-hidden border-t border-ink/10 bg-paper/95 shadow-[0_24px_60px_rgb(23_22_60/0.12)] transition-all duration-300 ease-[var(--ease-out)] md:hidden ${
            open ? "max-h-[24rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto grid w-full max-w-[38rem] gap-2 px-4 pb-4 pt-2">
            {links.map((link, index) => (
              <Link
                key={link.href}
                className={`rounded-xl bg-bone px-4 py-4 text-sm font-black uppercase transition duration-300 hover:bg-stonewash ${
                  open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                }`}
                href={link.href}
                style={{ transitionDelay: open ? `${index * 35}ms` : "0ms" }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              className={`rounded-xl border border-ink/10 bg-paper px-4 py-4 text-sm font-black uppercase transition duration-300 hover:border-caramel ${
                open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
              }`}
              href={switchHref}
              style={{ transitionDelay: open ? `${links.length * 35}ms` : "0ms" }}
              onClick={() => setOpen(false)}
            >
              {t.language}
            </Link>
          </div>
        </nav>
      </header>
      <div className="h-[4.25rem] md:h-[4.85rem]" aria-hidden="true" />
    </>
  );
}
