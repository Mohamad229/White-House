import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/auth";

const allowed = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const maxUploadSize = 4 * 1024 * 1024;

export async function POST(request: Request) {
  await requireAdmin();
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  if (!allowed.has(file.type))
    return NextResponse.json(
      { error: "Unsupported image type" },
      { status: 400 },
    );
  if (file.size > maxUploadSize)
    return NextResponse.json(
      { error: "Image is too large. Upload an image under 4MB." },
      { status: 400 },
    );

  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") || "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const blob = await put(`uploads/${filename}`, file, {
    access: "public",
    contentType: file.type,
  });

  return NextResponse.json({ url: blob.url });
}
