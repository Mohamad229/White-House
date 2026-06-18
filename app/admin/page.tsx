import Link from "next/link";
import { AdminError } from "@/components/admin/AdminError";
import { AdminHeader, AdminShell } from "@/components/admin/AdminShell";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth";
import { getAdminSummary } from "@/lib/data";
import { formatMoney } from "@/lib/format";

export default async function Page() {
  const session = await getAdminSession();
  if (!session) {
    return (
      <div className="grid min-h-screen place-items-center bg-bone p-4" dir="rtl" lang="ar">
        <LoginForm />
      </div>
    );
  }
  let summary;
  try {
    summary = await getAdminSummary();
  } catch {
    return (
      <AdminShell>
        <AdminHeader title="Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ…" />
        <AdminError />
      </AdminShell>
    );
  }
  return (
    <AdminShell>
      <AdminHeader title="لوحة التحكم" />
      <section className="premium-card overflow-hidden bg-ink p-5 text-ink sm:p-7">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-brass">White House Store</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
          نظرة سريعة على الطلبات والمنتجات التي يحتاجها فريق المتجر اليوم.
        </h2>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Metric label="طلبات جديدة" value={summary.newOrders} />
        <Metric label="منتجات ظاهرة" value={summary.visibleProducts} />
        <Metric label="الأقسام" value={summary.categories} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ["/admin/products/new", "إضافة منتج"],
          ["/admin/products", "إدارة المنتجات"],
          ["/admin/categories", "إدارة الأقسام"],
          ["/admin/orders", "متابعة الطلبات"]
        ].map(([href, label]) => (
          <Link key={href} href={href} className="tap-target rounded-2xl bg-paper p-5 text-lg font-black shadow-[0_14px_40px_rgb(23_22_60/0.08)] transition hover:text-caramel">
            {label}
          </Link>
        ))}
      </div>

      <section className="premium-card mt-8 p-5">
        <h2 className="mb-4 text-2xl font-black">آخر الطلبات</h2>
        <div className="grid gap-3">
          {summary.recentOrders.map((order: any) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`} className="grid gap-2 rounded-2xl bg-bone p-4 sm:grid-cols-3 sm:items-center">
              <span className="font-black">{order.code}</span>
              <span className="text-muted">{order.customerName}</span>
              <span className="font-black sm:text-left">{formatMoney(order.total, order.currency, "ar")}</span>
            </Link>
          ))}
          {summary.recentOrders.length === 0 && <p className="rounded-2xl bg-bone p-5 text-muted">لا توجد طلبات بعد.</p>}
        </div>
      </section>
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="premium-card p-5">
      <p className="text-sm font-black text-caramel">{label}</p>
      <p className="mt-3 text-5xl font-black">{value}</p>
    </div>
  );
}
