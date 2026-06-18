import Link from "next/link";
import type { ReactNode } from "react";
import { dictionary, localPath, textByLocale } from "@/lib/i18n";
import type { CategoryView, Locale, StoreSettingsView } from "@/lib/types";
import { BrandMark } from "./BrandMark";

type IconName = "email" | "phone" | "whatsapp" | "facebook" | "instagram";

const footerCopy = {
  ar: {
    panel: "تواصل معنا لمعرفة القطع المتاحة وتفاصيل الطلب",
    action: "تواصل معنا",
    company: "الشركة",
    support: "الدعم",
    fallbackAbout: "White House، متجر رجالي مركز على الطلب البسيط عبر واتساب.",
    fallbackLocation:
      "دمشق، سوريا. يتم تأكيد تفاصيل التوصيل والاستلام عبر واتساب.",
  },
  en: {
    panel: "Find out about the pieces available at your local shop",
    action: "Contact us",
    company: "Company",
    support: "Support",
    fallbackAbout:
      "White House, a focused men's T-shirt store built for simple ordering.",
    fallbackLocation:
      "Damascus, Syria. Delivery and pickup details are confirmed through WhatsApp.",
  },
} as const;

const footerBackground = "/brand/footer-image.jpg";

const marqueeItems = Array.from({ length: 6 }, (_, index) => index);

function formatPhoneLabel(phone: string) {
  const value = phone.trim();
  const digits = value.replace(/\D/g, "");

  if (!digits) return value;

  return `+${digits}`;
}

function phoneHref(phone: string) {
  const value = phone.trim();
  const digits = value.replace(/\D/g, "");

  if (!digits) return value ? `tel:${value}` : "";

  return `tel:+${digits}`;
}

export function Footer({
  locale,
  categories,
  settings,
}: {
  locale: Locale;
  categories: CategoryView[];
  settings: StoreSettingsView;
}) {
  const t = dictionary[locale];
  const f = footerCopy[locale];
  const isRtl = locale === "ar";
  const aboutText =
    textByLocale(locale, settings.aboutAr, settings.aboutEn) || f.fallbackAbout;
  const locationText =
    textByLocale(locale, settings.locationAr, settings.locationEn) ||
    f.fallbackLocation;
  const whatsappNumber = settings.whatsappNumber.replace(/[^\d]/g, "");
  const whatsappHref =
    settings.whatsappUrl ||
    (whatsappNumber ? `https://wa.me/${whatsappNumber}` : "");
  const supportPhone = settings.supportPhone || settings.whatsappNumber || "";
  const hasCategories = categories.length > 0;

  const supportItems = [
    settings.supportEmail
      ? {
          icon: "email" as const,
          label: settings.supportEmail,
          href: `mailto:${settings.supportEmail}`,
        }
      : null,
    supportPhone
      ? {
          icon: "phone" as const,
          label: formatPhoneLabel(supportPhone),
          href: phoneHref(supportPhone),
        }
      : null,
  ].filter(Boolean) as {
    icon: Exclude<IconName, "whatsapp">;
    label: string;
    href: string;
  }[];

  const socialItems = [
    settings.facebookUrl
      ? {
          icon: "facebook" as const,
          label: "Facebook",
          href: settings.facebookUrl,
        }
      : null,
    whatsappHref
      ? { icon: "whatsapp" as const, label: "WhatsApp", href: whatsappHref }
      : null,
    settings.instagramUrl
      ? {
          icon: "instagram" as const,
          label: "Instagram",
          href: settings.instagramUrl,
        }
      : null,
  ].filter(Boolean) as { icon: IconName; label: string; href: string }[];

  const contactHref =
    whatsappHref ||
    (settings.supportEmail
      ? `mailto:${settings.supportEmail}`
      : localPath(locale, "/products"));

  return (
    <footer
      id="about"
      dir={isRtl ? "rtl" : "ltr"}
      className={`wh-footer-root ${
        isRtl ? "wh-footer-rtl" : "wh-footer-ltr"
      } overflow-hidden bg-ink text-paper`}
    >
      <div className="wh-footer-marquee-wrap">
        <div className="wh-footer-marquee" aria-hidden="true" dir="ltr">
          <div className="wh-marquee-track">
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span className="wh-marquee-item" key={`${item}-${index}`}>
                <img
                  src="/brand/logo_shape.svg"
                  alt=""
                  className="h-7 w-auto shrink-0 sm:h-9"
                />
                <img
                  src="/brand/title.svg"
                  alt=""
                  className="h-5 w-auto shrink-0 sm:h-6"
                />
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="relative isolate flex min-h-[360px] items-center justify-center overflow-hidden bg-ink px-5 py-14 text-center sm:min-h-[390px] sm:py-16 lg:min-h-[420px] lg:py-16">
        <div
          className="absolute inset-0 -z-30 bg-cover bg-center opacity-90"
          style={{ backgroundImage: `url('${footerBackground}')` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-20 bg-ink/76" aria-hidden="true" />
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07),transparent_36%),linear-gradient(90deg,rgba(23,22,60,0.86),rgba(23,22,60,0.58),rgba(23,22,60,0.9))]"
          aria-hidden="true"
        />

        <div className="mx-auto flex w-full max-w-[840px] flex-col items-center">
          <h2 className="max-w-[820px] text-balance text-[2.45rem] font-black leading-[0.98] tracking-[-0.06em] text-paper sm:text-[3.45rem] lg:text-[4.35rem]">
            {f.panel}
          </h2>
          <a
            href={contactHref}
            className="mt-8 inline-flex min-h-11 min-w-[150px] items-center justify-center rounded-full border border-paper/22 bg-ink/18 px-8 text-xs font-black uppercase tracking-[0.06em] text-paper shadow-[0_18px_42px_rgba(0,0,0,0.18)] transition hover:border-paper hover:bg-paper hover:text-ink focus:outline-none focus:ring-2 focus:ring-paper/60"
          >
            {f.action}
          </a>
        </div>
      </section>

      <section className="border-t border-paper/5 bg-ink px-5 py-12 sm:px-8 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.12fr_0.75fr_1.18fr] lg:gap-24">
          <div className="wh-footer-brand max-w-md">
            <BrandMark inverse titleVariant="admin" />
            <p className="mt-5 max-w-sm text-sm leading-7 text-paper/78 sm:text-[0.98rem]">
              {aboutText}
            </p>
          </div>

          <FooterColumn title={f.company}>
            <Link href={localPath(locale, "/")}>{t.home}</Link>
            <Link href={localPath(locale, "/products")}>{t.products}</Link>
            {hasCategories && (
              <Link href={localPath(locale, "/#categories")}>{t.categories}</Link>
            )}
            <a href={contactHref}>{t.contact}</a>
          </FooterColumn>

          <div className="wh-footer-support">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-paper">
              {f.support}
            </p>
            <div className="grid gap-4 text-sm text-paper/78 sm:text-[0.98rem]">
              <p className="wh-footer-location max-w-md text-pretty font-semibold leading-7 text-paper/92">
                {locationText}
              </p>
              {supportItems.map((item) => (
                <a
                  key={item.icon}
                  className="wh-footer-contact-link transition hover:text-paper"
                  href={item.href}
                  dir="ltr"
                >
                  <SocialIcon
                    name={item.icon}
                    className="h-5 w-5 shrink-0 opacity-80"
                  />
                  <span className="wh-footer-contact-label">{item.label}</span>
                </a>
              ))}
            </div>

            {socialItems.length > 0 && (
              <div className="wh-footer-socials mt-8">
                {socialItems.map((item) => (
                  <a
                    key={item.icon}
                    href={item.href}
                    aria-label={item.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/16 text-paper/78 transition hover:border-paper hover:bg-paper hover:text-ink"
                  >
                    <SocialIcon name={item.icon} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="wh-footer-column">
      <p className="mb-5 text-xs font-black uppercase tracking-[0.24em] text-paper">
        {title}
      </p>
      <div className="wh-footer-column-links">{children}</div>
    </div>
  );
}

function SocialIcon({
  name,
  className = "h-5 w-5",
}: {
  name: IconName;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "email")
    return (
      <svg {...common}>
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );

  if (name === "phone")
    return (
      <svg {...common}>
        <path d="M22 16.9v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.6 2.61a2 2 0 0 1-.45 2.11L8 9.7a16 16 0 0 0 6.3 6.3l1.26-1.26a2 2 0 0 1 2.11-.45c.84.28 1.71.48 2.61.6A2 2 0 0 1 22 16.9Z" />
      </svg>
    );

  if (name === "whatsapp")
    return (
      <svg {...common}>
        <path d="M20 11.5a8 8 0 0 1-11.9 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" />
        <path d="M9.5 8.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.3 0 .5-.2.7l-.4.5c.7 1.2 1.6 2.1 2.9 2.8l.5-.5c.2-.2.5-.3.8-.2l1.6.7c.3.1.4.3.4.6v.4c0 .4-.2.7-.6.9-.8.4-2.1.2-3.7-.6-1.5-.8-2.8-2.1-3.6-3.6-.8-1.6-1-2.9-.6-3.6Z" />
      </svg>
    );

  if (name === "facebook")
    return (
      <svg {...common}>
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />
      </svg>
    );

  return (
    <svg {...common}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}
