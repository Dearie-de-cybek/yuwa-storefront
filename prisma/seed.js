const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// 12 products mapped to /public/models/1.jpg .. 12.jpg
// mood/silhouette power the Style Quiz recommendation scoring.
const PRODUCTS = [
  { n: 1,  name: 'The Zaria Silk Bubu',     cat: 'luxury', price: 180000, compareAt: null,   material: '100% Adire Silk',   featured: true,  occ: 'EVERYDAY', mood: 'ELEGANT',  sil: 'FLOWING',   colors: ['Emerald', 'Clay'] },
  { n: 2,  name: 'Lagos City Midi',         cat: 'rtw',    price: 120000, compareAt: 150000, material: 'Ankara Cotton',     featured: false, occ: 'EVERYDAY', mood: 'BOLD',     sil: 'FITTED',    colors: ['Indigo', 'Coral'] },
  { n: 3,  name: 'Aso-Oke Empire Gown',     cat: 'luxury', price: 320000, compareAt: null,   material: 'Woven Aso-Oke',     featured: true,  occ: 'WEDDING',  mood: 'DRAMATIC', sil: 'STATEMENT', colors: ['Gold', 'Burgundy'] },
  { n: 4,  name: 'Adire Wrap Dress',        cat: 'rtw',    price: 95000,  compareAt: null,   material: 'Hand-Dyed Adire',   featured: true,  occ: 'EVERYDAY', mood: 'MINIMAL',  sil: 'FITTED',    colors: ['Indigo', 'Ivory'] },
  { n: 5,  name: 'Ankara Power Suit',       cat: 'rtw',    price: 145000, compareAt: null,   material: 'Wax Print Cotton',  featured: false, occ: 'PROM',     mood: 'BOLD',     sil: 'FITTED',    colors: ['Royal Blue', 'Black'] },
  { n: 6,  name: 'Ijele Ceremonial Bubu',   cat: 'luxury', price: 275000, compareAt: 300000, material: 'Silk Chiffon',      featured: true,  occ: 'WEDDING',  mood: 'ELEGANT',  sil: 'FLOWING',   colors: ['Plum', 'Champagne'] },
  { n: 7,  name: 'Sahara Linen Co-ord',     cat: 'rtw',    price: 110000, compareAt: null,   material: 'Pure Linen',        featured: false, occ: 'EVERYDAY', mood: 'MINIMAL',  sil: 'FLOWING',   colors: ['Champagne', 'Teal'] },
  { n: 8,  name: 'Benin Bronze Kaftan',     cat: 'luxury', price: 210000, compareAt: null,   material: 'Brocade Silk',      featured: false, occ: 'DINNER',   mood: 'DRAMATIC', sil: 'FLOWING',   colors: ['Gold', 'Black'] },
  { n: 9,  name: 'Nok Terracotta Maxi',     cat: 'rtw',    price: 130000, compareAt: null,   material: 'Crepe',             featured: true,  occ: 'DINNER',   mood: 'ELEGANT',  sil: 'FITTED',    colors: ['Coral', 'Clay'] },
  { n: 10, name: 'Kano Indigo Boubou',      cat: 'luxury', price: 240000, compareAt: null,   material: 'Adire Silk',        featured: false, occ: 'EVERYDAY', mood: 'ELEGANT',  sil: 'STATEMENT', colors: ['Indigo', 'White'] },
  { n: 11, name: 'Yoruba Gele Set',         cat: 'rtw',    price: 105000, compareAt: 135000, material: 'Aso-Oke Blend',     featured: false, occ: 'WEDDING',  mood: 'BOLD',     sil: 'STATEMENT', colors: ['Burgundy', 'Gold'] },
  { n: 12, name: 'Eko Sunset Gown',         cat: 'luxury', price: 298000, compareAt: null,   material: 'Silk Satin',        featured: true,  occ: 'PROM',     mood: 'DRAMATIC', sil: 'STATEMENT', colors: ['Coral', 'Plum'] },
];

const SIZES = ['S', 'M', 'L'];
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// "How to Wear It" styling guidance, keyed by product `n`. Kept separate
// from PRODUCTS so that array stays readable.
const WEAR_IT = {
  1:  { mood: 'Effortless. Elegant. Understated.', occasions: ['Everyday luxury', 'Weekend brunch', 'Date night'], styleWith: ['Gold hoop earrings', 'Minimal leather sandals', 'A woven tote'] },
  2:  { mood: 'City-chic. Confident. Fast-paced.', occasions: ['Office to evening', 'Lagos city days', 'Casual dinners'], styleWith: ['Block heels', 'A structured bag', 'Layered gold necklaces'] },
  3:  { mood: 'Regal. Ceremonial. Unforgettable.', occasions: ['Weddings', 'Traditional celebrations', 'Engagement ceremonies'], styleWith: ['Statement gele', 'Coral bead jewellery', 'Embellished clutch'] },
  4:  { mood: 'Clean. Modern. Quietly confident.', occasions: ['Work', 'Daytime events', 'Coffee dates'], styleWith: ['Delicate gold jewellery', 'Nude flats', 'A slim belt'] },
  5:  { mood: 'Bold. Sharp. Unapologetic.', occasions: ['Prom', 'Cocktail parties', 'Evening events'], styleWith: ['Statement earrings', 'A sleek clutch', 'Strappy heels'] },
  6:  { mood: 'Flowing. Ceremonial. Deeply elegant.', occasions: ['Weddings', 'Traditional celebrations', 'Milestone events'], styleWith: ['Gold statement earrings', 'A beaded headwrap', 'Nude heels'] },
  7:  { mood: 'Relaxed. Breezy. Effortless.', occasions: ['Vacation', 'Garden parties', 'Sunday brunch'], styleWith: ['Straw accessories', 'Simple gold jewellery', 'Flat sandals'] },
  8:  { mood: 'Dramatic. Rich. Commanding.', occasions: ['Dinner', 'Evening events', 'Special occasions'], styleWith: ['Bold cuff bracelet', 'A structured clutch', 'Block heels'] },
  9:  { mood: 'Refined. Warm. Quietly striking.', occasions: ['Dinner', 'Date night', 'Cocktail hour'], styleWith: ['Drop earrings', 'A mini clutch', 'Strappy sandals'] },
  10: { mood: 'Statement. Grounded. Timeless.', occasions: ['Traditional celebrations', 'Family gatherings', 'Special occasions'], styleWith: ['Layered beads', 'A geled headwrap', 'Block heels'] },
  11: { mood: 'Bold. Ceremonial. Full of presence.', occasions: ['Weddings', 'Traditional celebrations', 'Aso-ebi occasions'], styleWith: ['Coordinating gele', 'Gold jewellery set', 'Embellished sandals'] },
  12: { mood: 'Dramatic. Radiant. Made for the spotlight.', occasions: ['Prom', 'Galas', 'Evening celebrations'], styleWith: ['Statement earrings', 'A metallic clutch', 'Strappy heels'] },
};

// Accessories powering "Complete The Look". Single "One Size" variant each —
// real accessory sizing (ring sizes, shoe sizes) is out of scope for the demo
// capsule, but the schema (Variant + LookItem.slot) is ready for it.
// Images verified live on Unsplash before seeding.
const ACCESSORIES = [
  {
    key: 'headwrap',
    name: 'Beaded Gele Headwrap',
    catName: 'Headwraps',
    catSlug: 'headwraps',
    price: 28000,
    material: 'Hand-Beaded Aso-Oke',
    image: 'https://images.unsplash.com/photo-1783038312854-f84ae9a0cc2f?q=80&w=1000',
    slot: 'HEADWRAP',
  },
  {
    key: 'bag',
    name: 'Structured Clutch',
    catName: 'Bags',
    catSlug: 'bags',
    price: 45000,
    material: 'Vegan Leather',
    image: 'https://images.unsplash.com/photo-1613482184847-44483b792eeb?q=80&w=1000',
    slot: 'BAG',
  },
  {
    key: 'jewellery',
    name: 'Gold Statement Earrings',
    catName: 'Jewellery',
    catSlug: 'jewellery',
    price: 22000,
    material: '18k Gold Plated Brass',
    image: 'https://images.unsplash.com/photo-1553926297-57bb350c4f08?q=80&w=1000',
    slot: 'JEWELLERY',
  },
  {
    key: 'shoes',
    name: 'Nude Block Heels',
    catName: 'Shoes',
    catSlug: 'shoes',
    price: 38000,
    material: 'Satin',
    image: 'https://images.unsplash.com/photo-1770150138451-c2b898d02c25?q=80&w=1000',
    slot: 'SHOES',
  },
];

// Look capsules: pair every dress with the full accessories set so "Wear It
// With" has real shoppable products on every product page. Same accessory
// products reused across looks — a small real-world capsule, not a bespoke
// set per dress.
const LOOKS = PRODUCTS.map((p) => ({ dressN: p.n, name: `The ${p.name} Look` }));

async function main() {
  console.log('🌱 Starting seeder...');

  // 1. CLEANUP (respect FK order)
  console.log('🧹 Clearing old data...');
  await prisma.lookItem.deleteMany().catch(() => {});
  await prisma.look.deleteMany().catch(() => {});
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
  const productByN = {};
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

    const created = await prisma.product.create({
      data: {
        name: p.name,
        slug: `${slugify(p.name)}-${p.n}`,
        description: `${p.name} — crafted from ${p.material.toLowerCase()}. A YUWA signature piece designed for the woman who carries her heritage with quiet confidence.`,
        price: p.price,
        compareAt: p.compareAt,
        status: 'ACTIVE',
        featured: p.featured,
        occasion: p.occ,
        mood: p.mood,
        silhouette: p.sil,
        wearMood: WEAR_IT[p.n]?.mood || null,
        wearOccasions: WEAR_IT[p.n]?.occasions || [],
        wearStyleWith: WEAR_IT[p.n]?.styleWith || [],
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
    productByN[p.n] = created;
  }

  // 5. ACCESSORIES — powers "Complete The Look". Each gets its own category
  // (so the shop's category filter can also surface them) and a single
  // "One Size" variant.
  console.log('👜 Creating accessories...');
  const accessoryProduct = {};
  for (const a of ACCESSORIES) {
    const cat = await prisma.category.create({
      data: { name: a.catName, slug: a.catSlug, description: `${a.catName} to complete the look.` },
    });

    const product = await prisma.product.create({
      data: {
        name: a.name,
        slug: `${slugify(a.name)}`,
        description: `${a.name} — crafted from ${a.material.toLowerCase()}. Styled as part of the YUWA Complete The Look capsule.`,
        price: a.price,
        status: 'ACTIVE',
        featured: false,
        material: a.material,
        categoryId: cat.id,
        createdById: admin.id,
        media: { create: [{ url: a.image, position: 0, altText: a.name }] },
        variants: {
          create: [{ color: 'Default', size: 'One Size', stock: 25, sku: `YUWA-ACC-${a.key.toUpperCase()}-OS` }],
        },
      },
    });
    accessoryProduct[a.key] = product;
  }

  // 6. LOOKS — pair each capsule dress with the full accessories set.
  console.log('💫 Creating "Complete The Look" capsules...');
  for (const l of LOOKS) {
    const dress = productByN[l.dressN];
    await prisma.look.create({
      data: {
        name: l.name,
        slug: slugify(l.name),
        items: {
          create: [
            { productId: dress.id, slot: 'DRESS', position: 0 },
            { productId: accessoryProduct.headwrap.id, slot: 'HEADWRAP', position: 1 },
            { productId: accessoryProduct.bag.id, slot: 'BAG', position: 2 },
            { productId: accessoryProduct.jewellery.id, slot: 'JEWELLERY', position: 3 },
            { productId: accessoryProduct.shoes.id, slot: 'SHOES', position: 4 },
          ],
        },
      },
    });
  }

  console.log(`✅ Seeded ${PRODUCTS.length} products, ${ACCESSORIES.length} accessories, ${LOOKS.length} looks, 2 users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
