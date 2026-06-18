import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const existing = await prisma.storeSettings.findFirst();
  const required = [
    "storeNameAr",
    "storeNameEn",
    "whatsappNumber",
    "supportEmail",
    "aboutAr",
    "aboutEn",
    "locationAr",
    "locationEn",
  ];
  if (required.some((key) => !String(body[key] || "").trim())) {
    return NextResponse.json(
      { error: "Missing required settings fields." },
      { status: 400 },
    );
  }
  const data = {
    storeNameAr: String(body.storeNameAr || "وايت هاوس"),
    storeNameEn: String(body.storeNameEn || "White House"),
    whatsappNumber: String(body.whatsappNumber || ""),
    supportPhone: String(body.supportPhone || ""),
    supportEmail: String(body.supportEmail || ""),
    defaultCurrency: "SYP",
    facebookUrl: String(body.facebookUrl || ""),
    whatsappUrl: String(body.whatsappUrl || ""),
    instagramUrl: String(body.instagramUrl || ""),
    aboutAr: String(body.aboutAr || ""),
    aboutEn: String(body.aboutEn || ""),
    locationAr: String(body.locationAr || ""),
    locationEn: String(body.locationEn || ""),
    whatsappTemplateAr: String(body.whatsappTemplateAr || ""),
    whatsappTemplateEn: String(body.whatsappTemplateEn || ""),
  };
  const settings = existing
    ? await prisma.storeSettings.update({ where: { id: existing.id }, data })
    : await prisma.storeSettings.create({ data });
  return NextResponse.json(settings);
}
