import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/password";
import { seedCategories, seedProducts, seedSettings } from "../lib/seed-data";

async function main() {
  const { id: settingsId, ...settingsData } = seedSettings;
  await prisma.storeSettings.upsert({
    where: { id: settingsId },
    update: settingsData,
    create: { id: settingsId, ...settingsData }
  });

  for (const category of seedCategories) {
    const { id, ...categoryData } = category;
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: categoryData,
      create: { id, ...categoryData }
    });
  }

  for (const product of seedProducts) {
    const { images, colors, category, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        categoryId: productData.categoryId,
        internalCode: productData.internalCode,
        nameAr: productData.nameAr,
        nameEn: productData.nameEn,
        descriptionAr: productData.descriptionAr,
        descriptionEn: productData.descriptionEn,
        shortDescriptionAr: productData.shortDescriptionAr,
        shortDescriptionEn: productData.shortDescriptionEn,
        price: productData.price,
        currency: productData.currency,
        status: productData.status,
        isFeatured: productData.isFeatured
      },
      create: {
        ...productData
      }
    });
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productColor.deleteMany({ where: { productId: product.id } });
    if (images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map(({ id, ...image }) => ({ id, productId: product.id, ...image }))
      });
    }
    for (const color of colors) {
      const { variants, ...colorData } = color;
      await prisma.productColor.create({ data: { ...colorData, productId: product.id } });
      if (variants.length > 0) {
        await prisma.productVariant.createMany({
          data: variants.map(({ id, colorId, ...variant }) => ({
            id,
            productId: product.id,
            colorId,
            ...variant
          }))
        });
      }
    }
  }

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin12345";
  await prisma.adminUser.upsert({
    where: { username },
    update: { passwordHash: hashPassword(password) },
    create: { username, passwordHash: hashPassword(password) }
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
