import { readFile } from "node:fs/promises";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

type DataExport = {
  adminUsers: Record<string, unknown>[];
  categories: Record<string, unknown>[];
  products: Record<string, unknown>[];
  productImages: Record<string, unknown>[];
  productColors: Record<string, unknown>[];
  productVariants: Record<string, unknown>[];
  orders: Record<string, unknown>[];
  orderItems: Record<string, unknown>[];
  storeSettings: Record<string, unknown>[];
};

const dateFields = new Set([
  "createdAt",
  "updatedAt",
  "whatsappOpenedAt",
]);

function reviveDates<T extends Record<string, unknown>>(record: T): T {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [
      key,
      dateFields.has(key) && typeof value === "string" ? new Date(value) : value,
    ]),
  ) as T;
}

async function main() {
  const inputPath = path.join(process.cwd(), "prisma", "data", "export.json");
  const data = JSON.parse(await readFile(inputPath, "utf8")) as DataExport;

  await prisma.$transaction(
    async (tx) => {
      await tx.orderItem.deleteMany();
      await tx.order.deleteMany();
      await tx.productVariant.deleteMany();
      await tx.productImage.deleteMany();
      await tx.productColor.deleteMany();
      await tx.product.deleteMany();
      await tx.category.deleteMany();
      await tx.storeSettings.deleteMany();
      await tx.adminUser.deleteMany();

      if (data.adminUsers.length) {
        await tx.adminUser.createMany({
          data: data.adminUsers.map(reviveDates) as any,
        });
      }
      if (data.categories.length) {
        await tx.category.createMany({
          data: data.categories.map(reviveDates) as any,
        });
      }
      if (data.products.length) {
        await tx.product.createMany({
          data: data.products.map(reviveDates) as any,
        });
      }
      if (data.productColors.length) {
        await tx.productColor.createMany({
          data: data.productColors.map(reviveDates) as any,
        });
      }
      if (data.productImages.length) {
        await tx.productImage.createMany({
          data: data.productImages.map(reviveDates) as any,
        });
      }
      if (data.productVariants.length) {
        await tx.productVariant.createMany({
          data: data.productVariants.map(reviveDates) as any,
        });
      }
      if (data.orders.length) {
        await tx.order.createMany({
          data: data.orders.map(reviveDates) as any,
        });
      }
      if (data.orderItems.length) {
        await tx.orderItem.createMany({
          data: data.orderItems.map(reviveDates) as any,
        });
      }
      if (data.storeSettings.length) {
        await tx.storeSettings.createMany({
          data: data.storeSettings.map(reviveDates) as any,
        });
      }
    },
    {
      maxWait: 20_000,
      timeout: 60_000,
    },
  );

  console.table({
    adminUsers: data.adminUsers.length,
    categories: data.categories.length,
    products: data.products.length,
    productImages: data.productImages.length,
    productColors: data.productColors.length,
    productVariants: data.productVariants.length,
    orders: data.orders.length,
    orderItems: data.orderItems.length,
    storeSettings: data.storeSettings.length,
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
