const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Seeding...');

  // 1. Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany(); // Wipes users, but we will recreate them immediately below!

  // --- 2. CREATE USERS (The Missing Piece) ---
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("password123", salt); 

  // A. Create the Admin
  const admin = await prisma.user.create({
    data: {
      firstName: "Daro",
      lastName: "Admin",
      email: "admin@yuwa.com",
      password: hashedPassword,
      role: "ADMIN" // "God Mode" enabled
    }
  });

  // B. Create a Customer (for testing)
  const customer = await prisma.user.create({
    data: {
      firstName: "Test",
      lastName: "Customer",
      email: "customer@yuwa.com",
      password: hashedPassword,
      role: "CUSTOMER"
    }
  });

  console.log(`👤 Created Admin: ${admin.email} (Pass: password123)`);
  console.log(`👤 Created Customer: ${customer.email} (Pass: password123)`);

  // --- 3. CREATE PRODUCTS ---
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

  console.log(`✅ Seeding Finished! Created Products: ${zaria.name}, ${lagos.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });