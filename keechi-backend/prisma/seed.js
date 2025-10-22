// prisma/seed.js - Initial demo data
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.salon.deleteMany();

  // Create demo salons
  const salon1 = await prisma.salon.create({
    data: {
      name: "Glamour Dhaka",
      area: "Gulshan",
      phone: "01700000001",
      services: "Haircut, Coloring, Bridal Makeup, Facial",
      address: "Road 123, Gulshan 2, Dhaka",
      imageUrl: "https://via.placeholder.com/300x200?text=Glamour+Dhaka",
    },
  });

  const salon2 = await prisma.salon.create({
    data: {
      name: "Beauty Parlour Elite",
      area: "Dhanmondi",
      phone: "01700000002",
      services: "Haircut, Threading, Waxing, Makeup",
      address: "Dhanmondi Lake Road, Dhaka",
      imageUrl: "https://via.placeholder.com/300x200?text=Beauty+Elite",
    },
  });

  const salon3 = await prisma.salon.create({
    data: {
      name: "Style Hub",
      area: "Mirpur",
      phone: "01700000003",
      services: "Haircut, Coloring, Pedicure, Manicure",
      address: "Mirpur 12, Dhaka",
      imageUrl: "https://via.placeholder.com/300x200?text=Style+Hub",
    },
  });

  console.log("✅ Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
