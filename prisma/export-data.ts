import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient();

async function main() {
  const data = {
    adminUsers: await prisma.adminUser.findMany(),
    categories: await prisma.category.findMany(),
    products: await prisma.product.findMany(),
    productImages: await prisma.productImage.findMany(),
    productColors: await prisma.productColor.findMany(),
    productVariants: await prisma.productVariant.findMany(),
    orders: await prisma.order.findMany(),
    orderItems: await prisma.orderItem.findMany(),
    storeSettings: await prisma.storeSettings.findMany(),
  };

  const outputDir = path.join(process.cwd(), "prisma", "data");
  const outputPath = path.join(outputDir, "export.json");
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, JSON.stringify(data, null, 2));

  console.log(`Exported data to ${outputPath}`);
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
