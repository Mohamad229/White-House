import Image from "next/image";
import Link from "next/link";
import { dictionary, localPath, textByLocale } from "@/lib/i18n";
import type { CategoryView, Locale, StoreSettingsView } from "@/lib/types";

type IconName = "email" | "phone" | "whatsapp" | "facebook" | "instagram" | "pin";

const footerCopy = {
  ar: {
    panel: "تواصل معنا لمعرفة القطع المتاحة وتفاصيل الطلب",
    action: "تواصل معنا",
    company: "الشركة",
    powered: "مدعوم من وايت هاوس",
    brand: "وايت هاوس"
  },
  en: {
    panel: "Find out about the pieces available at your local shop",
    action: "Contact us",
    company: "Company",
    powered: "Powered by White House",
    brand: "White House"
  }
} as const;

export function Footer({
  locale,
  categories,
  settings
}: {
  locale: Locale;
  categories: CategoryView[];
  settings: StoreSettingsView;
}) {
  const t = dictionary[locale];
  const f = footerCopy[locale];
  const whatsappNumber = settings.whatsappNumber.replace(/[^\d]/g, "");
  const visibleCategories = categories.slice(0, 5);
  const whatsappHref = settings.whatsappUrl || (whatsappNumber ? `https://wa.me/${whatsappNumber}` : "");
  const marqueeLabel = textByLocale(locale, settings.storeNameAr, settings.storeNameEn) || f.brand;
  const marqueeItems = Array.from({ length: 12 }, (_, index) => (
    <span key={index} className="inline-flex items-center gap-6 px-5">
      <span dir={t.dir}>{marqueeLabel}</span>
      <span className="grid h-9 w-9 place-items-center border border-ink/50 text-xl">WH</span>
      <span className="h-2 w-2 rounded-full bg-ink" />
    </span>
  ));
  const contactItems = [
    { icon: "email" as const, label: "Email", href: `mailto:${settings.supportEmail}` },
    { icon: "phone" as const, label: "Number", href: settings.supportPhone ? `tel:${settings.supportPhone}` : "" },
    { icon: "whatsapp" as const, label: "WhatsApp", href: whatsappHref },
    { icon: "facebook" as const, label: "Facebook", href: settings.facebookUrl || "" },
    { icon: "instagram" as const, label: "Instagram", href: settings.instagramUrl || "" }
  ].filter((item) => item.href);

  return (
    <footer id="about" className="mt-6 overflow-hidden bg-ink text-bone" dir={t.dir}>
      <div className="-mx-8 -rotate-1 border-y border-ink/20 bg-paper py-4 text-ink shadow-[0_20px_55px_rgb(0_0_0/0.26)]">
        <div
          className="marquee-track text-3xl font-black uppercase tracking-normal md:text-5xl"
          style={{ animation: "marquee-ltr 52s linear infinite" }}
          aria-hidden="true"
          dir="ltr"
        >
          <div className="marquee-group">{marqueeItems}</div>
          <div className="marquee-group">{marqueeItems}</div>
        </div>
      </div>

      <div className="grid min-h-[34rem] lg:grid-cols-[0.86fr_1.54fr]">
        <div className="relative isolate min-h-[31rem] overflow-hidden">
          <Image
            src="/brand/jacket-ink.png"
            alt="White House footer panel"
            fill
            sizes="(min-width: 1024px) 36vw, 100vw"
            className="object-cover object-center opacity-75"
          />
          <div className="absolute inset-0 bg-ink/80" />
          <div className="relative z-10 flex min-h-[31rem] flex-col items-center justify-center px-6 py-12 text-center sm:px-10 lg:px-16">
            <span className="grid h-16 w-16 place-items-center border-2 border-bone/80 text-4xl font-black uppercase">WH</span>
            <div className="mt-16 text-caramel">
              <SocialIcon name="pin" className="mx-auto h-6 w-6" />
            </div>
            <p className="mt-5 max-w-md text-4xl font-medium leading-tight tracking-normal md:text-5xl">{f.panel}</p>
            {whatsappHref && (
              <a
                href={whatsappHref}
                className="mt-10 inline-flex min-h-11 items-center justify-center border border-bone px-8 text-xs font-black uppercase tracking-normal text-bone transition hover:border-brass hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
              >
                {f.action}
              </a>
            )}
          </div>
        </div>

        <div className="grid content-center gap-16 px-6 py-14 sm:px-10 lg:px-16 xl:px-24">
          <div className="grid gap-10 md:grid-cols-[1fr_1fr_1fr_auto]">
            <FooterColumn title={t.categories}>
              {visibleCategories.map((category) => (
                <Link key={category.id} href={localPath(locale, `/products?category=${category.slug}`)}>
                  {textByLocale(locale, category.nameAr, category.nameEn)}
                </Link>
              ))}
            </FooterColumn>

            <FooterColumn title={f.company}>
              <Link href={localPath(locale, "/")}>{t.home}</Link>
              <Link href={localPath(locale, "/products")}>{t.products}</Link>
              <Link href={localPath(locale, "/#categories")}>{t.categories}</Link>
              <a href={`mailto:${settings.supportEmail}`}>{t.contact}</a>
            </FooterColumn>

            <FooterColumn title={t.support}>
              <a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a>
              {settings.supportPhone && <a href={`tel:${settings.supportPhone}`}>{settings.supportPhone}</a>}
              {whatsappHref && <a href={whatsappHref}>WhatsApp</a>}
            </FooterColumn>

            <div className="flex md:justify-end">
              <div className="grid gap-4 text-bone/60">
                {contactItems.map((item) => (
                  <a
                    key={item.icon}
                    href={item.href}
                    className="group grid h-9 w-9 place-items-center rounded-full text-bone/60 transition hover:text-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
                    aria-label={item.label}
                  >
                    <SocialIcon name={item.icon} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 text-sm text-bone/50 md:grid-cols-[1fr_auto] md:items-center">
            <span>{f.powered}</span>
            <span dir={t.dir}>{textByLocale(locale, settings.locationAr, settings.locationEn)}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-6 text-sm font-black uppercase tracking-normal text-bone">{title}</h3>
      <div className="grid gap-3 text-base leading-7 text-bone/60 [&_a]:transition [&_a:hover]:text-brass">{children}</div>
    </div>
  );
}

function SocialIcon({ name, className = "" }: { name: IconName; className?: string }) {
  const common = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    "aria-hidden": true
  };

  if (name === "email") {
    return (
      <svg {...common}>
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg {...common}>
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.7 19.7 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.7 19.7 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
      </svg>
    );
  }

  if (name === "whatsapp") {
    return (
      <svg {...common}>
        <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4Z" />
        <path d="M8.8 8.4c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4 0 .6l-.5.6c-.2.2-.2.4 0 .6.5.8 1.2 1.5 2.1 2 .2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.7-.1l1.8.9c.3.1.4.3.4.5 0 .7-.5 1.5-1.1 1.8-.7.4-1.6.4-2.8 0a9.2 9.2 0 0 1-5-4.4c-.7-1.2-.7-2.2-.4-2.9Z" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg {...common}>
        <path d="M14 8h2V4h-2a5 5 0 0 0-5 5v3H7v4h2v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1Z" />
      </svg>
    );
  }

  if (name === "instagram") {
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="5" />
        <circle cx="12" cy="12" r="3.2" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
