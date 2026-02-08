import bcrypt from "bcryptjs";
import { prisma } from "../src/db/prisma.js";

async function main() {
  const adminPass = await bcrypt.hash("Admin@123", 10);
  const ownerPass = await bcrypt.hash("Owner@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "System Administrator Demo User",
      email: "admin@demo.com",
      address: "Admin Address, City, Country",
      passwordHash: adminPass,
      role: "SYSTEM_ADMIN"
    }
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@demo.com" },
    update: {},
    create: {
      name: "Store Owner Demo Account User",
      email: "owner@demo.com",
      address: "Owner Address, City, Country",
      passwordHash: ownerPass,
      role: "STORE_OWNER"
    }
  });

  await prisma.store.upsert({
    where: { email: "store1@demo.com" },
    update: {},
    create: {
      name: "Demo Store One For Ratings",
      email: "store1@demo.com",
      address: "Store Address 1, City, Country",
      ownerId: owner.id
    }
  });

  await prisma.store.upsert({
    where: { email: "store2@demo.com" },
    update: {},
    create: {
      name: "Second Demo Store For Search",
      email: "store2@demo.com",
      address: "Store Address 2, City, Country"
    }
  });

  console.log("✅ Seed completed. Admin:", admin.email, "Owner:", owner.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
