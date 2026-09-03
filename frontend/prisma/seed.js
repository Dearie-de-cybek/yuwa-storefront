const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Enterprise Seeder...');

  // ============================================================
  // 1. CLEANUP (Order matters due to Foreign Keys!)
  // ============================================================
  console.log('🧹 Clearing old data...');
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.variantAttribute.deleteMany();
  await prisma.media.deleteMany();
  await prisma.productContentSection.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // ============================================================
  // 2. CREATE USERS
  // ============================================================
  console.log('👤 Creating Users...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt); 

  const admin = await prisma.user.create({
    data: {
      firstName: "Daro",
      lastName: "Admin",
      email: "admin@yuwa.com",
      password: hashedPassword,
      role: "ADMIN"
    }
  });

  const customer = await prisma.user.create({
    data: {
      firstName: "Amaka",
      lastName: "Shopper",
      email: "customer@yuwa.com",
      password: hashedPassword,
      role: "CUSTOMER"
    }
  });

  // ============================================================
  // 3. CREATE CATEGORIES (Required for Products)
  // ============================================================
  console.log('📂 Creating Categories...');
  
  const catLuxury = await prisma.category.create({
    data: {
      name: "Luxury Bubu",
      slug: "luxury-bubu",
      description: "Flowing elegance for the modern woman."
    }
  });

  const catRtw = await prisma.category.create({
    data: {
      name: "Ready-to-Wear",
      slug: "ready-to-wear",
      description: "Chic styles for everyday Lagos living."
    }
  });

  // ============================================================
  // 4. CREATE PRODUCTS (With Media, Variants & Sections)
  // ============================================================
  console.log('👗 Creating Products...');

  // --- PRODUCT 1: ZARIA SILK BUBU ---
  await prisma.product.create({
    data: {
      name: "The Zaria Silk Bubu",
      slug: "the-zaria-silk-bubu",
      description: "Hand-dyed Adire silk that flows like water. Designed for the modern woman who values comfort and class.",
      price: 180000.00,
      status: "ACTIVE",
      featured: true,
      material: "100% Adire Silk",
      categoryId: catLuxury.id, // Connect to Category
      createdById: admin.id,    // Connect to Admin (Audit)

      // A. Media (Images)
      media: {
        create: [
          { url: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000", position: 0, altText: "Front View" },
          { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000", position: 1, altText: "Back View" }
        ]
      },

      // B. Variants (SKU is required now!)
      variants: {
        create: [
          { color: "Emerald", size: "S", stock: 10, sku: "ZARIA-EM-S" },
          { color: "Emerald", size: "M", stock: 15, sku: "ZARIA-EM-M" },
          { color: "Clay", size: "M", stock: 8, sku: "ZARIA-CL-M" }
        ]
      },

      // C. Content Sections (Accordions)
      contentSections: {
        create: [
          { type: "FABRIC_CARE", title: "Fabric Care", content: "Dry clean only.\nDo not bleach.\nIron on low heat." },
          { type: "DETAILS", title: "Product Details", content: "Floor length: 60 inches.\nHidden side pockets.\nHandmade in Lagos." }
        ]
      }
    }
  });

  // --- PRODUCT 2: LAGOS CITY MIDI ---
  await prisma.product.create({
    data: {
      name: "Lagos City Midi",
      slug: "lagos-city-midi",
      description: "A versatile piece for the bustle of Lagos and the chic of London.",
      price: 120000.00,
      status: "ACTIVE",
      categoryId: catRtw.id,
      createdById: admin.id,

      media: {
        create: [
          { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000", position: 0 }
        ]
      },

      variants: {
        create: [
          { color: "Ankara Print", size: "S", stock: 20, sku: "LAGOS-ANK-S" },
          { color: "Ankara Print", size: "M", stock: 20, sku: "LAGOS-ANK-M" },
          { color: "Noir", size: "M", stock: 10, sku: "LAGOS-BLK-M" }
        ]
      }
    }
  });

  console.log('✅ Seeding Finished! Database is ready.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });