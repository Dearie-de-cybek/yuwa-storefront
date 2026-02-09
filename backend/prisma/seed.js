const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Seeding...');

  // 1. Clear existing data (optional, prevents duplicates)
  await prisma.orderItem.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Products with Variants
  const zaria = await prisma.product.create({
    data: {
      name: "The Zaria Silk Bubu",
      description: "Hand-dyed Adire silk that flows like water. Designed for the modern woman.",
      price: 180.00,
      category: "Luxury Bubu",
      images: [
        "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000", 
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000"
      ],
      variants: {
        create: [
          { color: "Emerald", size: "S", stock: 10 },
          { color: "Emerald", size: "M", stock: 15 },
          { color: "Emerald", size: "L", stock: 5 },
          { color: "Clay", size: "M", stock: 8 },
        ]
      }
    }
  });

  const lagos = await prisma.product.create({
    data: {
      name: "Lagos City Midi",
      description: "A versatile piece for the bustle of Lagos and the chic of London.",
      price: 120.00,
      category: "Ready-to-Wear",
      images: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000",
        "https://images.unsplash.com/photo-1572804013427-4d7ca2736179?q=80&w=1000"
      ],
      variants: {
        create: [
          { color: "Ankara Print", size: "S", stock: 20 },
          { color: "Ankara Print", size: "M", stock: 20 },
          { color: "Noir", size: "M", stock: 10 },
        ]
      }
    }
  });

  const othello = await prisma.product.create({
    data: {
      name: "Othello Maxi",
      description: "Golden chiffon that captures the sunset. Limited edition.",
      price: 210.00,
      category: "Luxury Bubu",
      images: [
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1000"
      ],
      variants: {
        create: [
          { color: "Gold", size: "L", stock: 5 },
          { color: "Gold", size: "XL", stock: 3 },
        ]
      }
    }
  });

  console.log(`✅ Seeding Finished! Created ${zaria.name}, ${lagos.name}, etc.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });