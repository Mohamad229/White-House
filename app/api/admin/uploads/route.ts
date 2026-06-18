import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { requireAdmin } from "@/lib/auth";

const allowed = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const maxUploadSize = 10 * 1024 * 1024;

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
    return NextResponse.json({ error: "Image is too large" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = file.type.split("/")[1]?.replace("jpeg", "jpg") || "png";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  // Local uploads are fine for this deployment mode. On serverless hosts such as
  // Vercel, replace this with persistent object storage (S3, Cloudinary, etc.).
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), bytes);
  return NextResponse.json({ url: `/uploads/${filename}` });
}
