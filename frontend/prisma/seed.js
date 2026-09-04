const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// 12 products mapped to /public/models/1.jpg .. 12.jpg
const PRODUCTS = [
  { n: 1,  name: 'The Zaria Silk Bubu',     cat: 'luxury', price: 180000, compareAt: null,   material: '100% Adire Silk',   featured: true,  occ: 'EVERYDAY', colors: ['Emerald', 'Clay'] },
  { n: 2,  name: 'Lagos City Midi',         cat: 'rtw',    price: 120000, compareAt: 150000, material: 'Ankara Cotton',     featured: false, occ: 'EVERYDAY', colors: ['Indigo', 'Coral'] },
  { n: 3,  name: 'Aso-Oke Empire Gown',     cat: 'luxury', price: 320000, compareAt: null,   material: 'Woven Aso-Oke',     featured: true,  occ: 'WEDDING',  colors: ['Gold', 'Burgundy'] },
  { n: 4,  name: 'Adire Wrap Dress',        cat: 'rtw',    price: 95000,  compareAt: null,   material: 'Hand-Dyed Adire',   featured: true,  occ: 'EVERYDAY', colors: ['Indigo', 'Ivory'] },
  { n: 5,  name: 'Ankara Power Suit',       cat: 'rtw',    price: 145000, compareAt: null,   material: 'Wax Print Cotton',  featured: false, occ: 'PROM',     colors: ['Royal Blue', 'Black'] },
  { n: 6,  name: 'Ijele Ceremonial Bubu',   cat: 'luxury', price: 275000, compareAt: 300000, material: 'Silk Chiffon',      featured: true,  occ: 'WEDDING',  colors: ['Plum', 'Champagne'] },
  { n: 7,  name: 'Sahara Linen Co-ord',     cat: 'rtw',    price: 110000, compareAt: null,   material: 'Pure Linen',        featured: false, occ: 'EVERYDAY', colors: ['Champagne', 'Teal'] },
  { n: 8,  name: 'Benin Bronze Kaftan',     cat: 'luxury', price: 210000, compareAt: null,   material: 'Brocade Silk',      featured: false, occ: 'DINNER',   colors: ['Gold', 'Black'] },
  { n: 9,  name: 'Nok Terracotta Maxi',     cat: 'rtw',    price: 130000, compareAt: null,   material: 'Crepe',             featured: true,  occ: 'DINNER',   colors: ['Coral', 'Clay'] },
  { n: 10, name: 'Kano Indigo Boubou',      cat: 'luxury', price: 240000, compareAt: null,   material: 'Adire Silk',        featured: false, occ: 'EVERYDAY', colors: ['Indigo', 'White'] },
  { n: 11, name: 'Yoruba Gele Set',         cat: 'rtw',    price: 105000, compareAt: 135000, material: 'Aso-Oke Blend',     featured: false, occ: 'WEDDING',  colors: ['Burgundy', 'Gold'] },
  { n: 12, name: 'Eko Sunset Gown',         cat: 'luxury', price: 298000, compareAt: null,   material: 'Silk Satin',        featured: true,  occ: 'PROM',     colors: ['Coral', 'Plum'] },
];

const SIZES = ['S', 'M', 'L'];
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  console.log('🌱 Starting seeder...');

  // 1. CLEANUP (respect FK order)
  console.log('🧹 Clearing old data...');
  await prisma.orderItem.deleteMany();
  await prisma.orderNote.deleteMany().catch(() => {});
  await prisma.order.deleteMany().catch(() => {});
  await prisma.promotionUsage.deleteMany().catch(() => {});
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

  // 2. USERS
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', await bcrypt.genSalt(10));

  const admin = await prisma.user.create({
    data: { firstName: 'Daro', lastName: 'Admin', email: 'admin@yuwa.com', password: hashedPassword, role: 'ADMIN' },
  });
  await prisma.user.create({
    data: { firstName: 'Amaka', lastName: 'Shopper', email: 'customer@yuwa.com', password: hashedPassword, role: 'CUSTOMER' },
  });

  // 3. CATEGORIES
  console.log('📂 Creating categories...');
  const catLuxury = await prisma.category.create({
    data: { name: 'Luxury Bubu', slug: 'luxury-bubu', description: 'Flowing elegance for the modern woman.' },
  });
  const catRtw = await prisma.category.create({
    data: { name: 'Ready-to-Wear', slug: 'ready-to-wear', description: 'Chic styles for everyday Lagos living.' },
  });

  // 4. PRODUCTS (photos from /public/models)
  console.log('👗 Creating products from model photos...');
  for (const p of PRODUCTS) {
    const categoryId = p.cat === 'luxury' ? catLuxury.id : catRtw.id;
    const heroImg = `/models/${p.n}.jpg`;
    const secondImg = `/models/${(p.n % 12) + 1}.jpg`;

    const variants = [];
    p.colors.forEach((color, ci) => {
      SIZES.forEach((size, si) => {
        variants.push({
          color,
          size,
          stock: 5 + ci * 3 + si * 2,
          sku: `YUWA-${p.n}-${color.slice(0, 3).toUpperCase()}-${size}`,
        });
      });
    });

    await prisma.product.create({
      data: {
        name: p.name,
        slug: `${slugify(p.name)}-${p.n}`,
        description: `${p.name} — crafted from ${p.material.toLowerCase()}. A YUWA signature piece designed for the woman who carries her heritage with quiet confidence.`,
        price: p.price,
        compareAt: p.compareAt,
        status: 'ACTIVE',
        featured: p.featured,
        occasion: p.occ,
        material: p.material,
        categoryId,
        createdById: admin.id,
        media: {
          create: [
            { url: heroImg, position: 0, altText: `${p.name} front` },
            { url: secondImg, position: 1, altText: `${p.name} detail` },
          ],
        },
        variants: { create: variants },
        contentSections: {
          create: [
            { type: 'DETAILS', title: 'Product Details', content: `Material: ${p.material}.\nHandmade in Lagos.\nHidden side pockets.` },
            { type: 'FABRIC_CARE', title: 'Fabric & Care', content: 'Dry clean only.\nDo not bleach.\nIron on low heat.' },
            { type: 'SHIPPING_RETURNS', title: 'Shipping & Returns', content: 'Free express shipping over ₦250,000.\nReturns accepted within 14 days.' },
          ],
        },
      },
    });
  }

  console.log(`✅ Seeded ${PRODUCTS.length} products, 2 users, 2 categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
