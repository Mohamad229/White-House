import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const form = await request.formData();
  const status = String(form.get("status") || "new");
  if (!["new", "contacted", "completed", "cancelled"].includes(status)) {
    redirect(`/admin/orders/${id}`);
  }
  await prisma.order.update({ where: { id }, data: { status: status as any } });
  redirect(`/admin/orders/${id}`);
}
