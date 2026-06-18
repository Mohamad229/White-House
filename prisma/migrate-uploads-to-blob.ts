import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { put } from "@vercel/blob";
import { PrismaClient } from "@prisma/client";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

const mimeByExtension: Record<string, string> = {
  ".gif": "image/gif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function localUploadPath(value?: string | null) {
  const trimmed = String(value || "").trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed)) return null;

  const normalized = trimmed.replace(/^\/+/, "");
  if (!normalized.startsWith("uploads/")) return null;

  return {
    publicUrl: `/${normalized}`,
    blobPathname: normalized.replace(/\\/g, "/"),
    filePath: path.join(process.cwd(), "public", ...normalized.split("/")),
  };
}

async function uploadLocalFile(value: string, cache: Map<string, string>) {
  const local = localUploadPath(value);
  if (!local) return value;

  const cached = cache.get(local.publicUrl);
  if (cached) return cached;

  const bytes = await readFile(local.filePath);
  const contentType =
    mimeByExtension[path.extname(local.filePath).toLowerCase()] ||
    "application/octet-stream";

  const blob = await put(local.blobPathname, bytes, {
    access: "public",
    allowOverwrite: true,
    contentType,
  });

  cache.set(local.publicUrl, blob.url);
  console.log(`${local.publicUrl} -> ${blob.url}`);
  return blob.url;
}

async function main() {
  const uploadedUrls = new Map<string, string>();
  const [categories, images, colors, orderItems] = await Promise.all([
    prisma.category.findMany({ select: { id: true, imageUrl: true } }),
    prisma.productImage.findMany({ select: { id: true, url: true } }),
    prisma.productColor.findMany({ select: { id: true, imageUrl: true } }),
    prisma.orderItem.findMany({ select: { id: true, imageUrl: true } }),
  ]);

  let updated = 0;

  for (const category of categories) {
    const imageUrl = await uploadLocalFile(category.imageUrl || "", uploadedUrls);
    if (imageUrl !== category.imageUrl) {
      await prisma.category.update({
        where: { id: category.id },
        data: { imageUrl },
      });
      updated += 1;
    }
  }

  for (const image of images) {
    const url = await uploadLocalFile(image.url, uploadedUrls);
    if (url !== image.url) {
      await prisma.productImage.update({
        where: { id: image.id },
        data: { url },
      });
      updated += 1;
    }
  }

  for (const color of colors) {
    const imageUrl = await uploadLocalFile(color.imageUrl || "", uploadedUrls);
    if (imageUrl !== color.imageUrl) {
      await prisma.productColor.update({
        where: { id: color.id },
        data: { imageUrl },
      });
      updated += 1;
    }
  }

  for (const item of orderItems) {
    const imageUrl = await uploadLocalFile(item.imageUrl || "", uploadedUrls);
    if (imageUrl !== item.imageUrl) {
      await prisma.orderItem.update({
        where: { id: item.id },
        data: { imageUrl },
      });
      updated += 1;
    }
  }

  console.log(`Uploaded ${uploadedUrls.size} files and updated ${updated} rows.`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
