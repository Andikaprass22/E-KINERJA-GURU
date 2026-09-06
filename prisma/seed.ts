import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcrypt";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  const users = [
    {
      name: "Administrator",
      email: "admin@sekolah.id",
      username: "admin",
      password: "admin12345",
      role: "ADMIN" as const,
    },
    {
      name: "Kepala Sekolah",
      email: "kepsek@sekolah.id",
      username: "kepsek",
      password: "kepsek12345",
      role: "PRINCIPAL" as const,
    },
    {
      name: "Guru Contoh",
      email: "guru@sekolah.id",
      username: "guru",
      password: "guru12345",
      role: "TEACHER" as const,
    },
  ];

  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { username: user.username },
    });

    if (existing) {
      console.log(`User ${user.username} already exists, skipping.`);
      continue;
    }

    try {
      const passwordHash = await bcrypt.hash(user.password, 10);

      const newUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
          isActive: true,
          emailVerified: false,
        },
      });

      await prisma.account.create({
        data: {
          userId: newUser.id,
          accountId: newUser.id,
          providerId: "credential",
          password: passwordHash,
        },
      });

      console.log(`✓ Created user: ${user.username} (${user.role})`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
    } catch (error) {
      console.error(`Failed to create user ${user.username}:`, error);
    }
  }

  console.log("\n✅ Seed completed successfully!");
  console.log("\nYou can now login with these accounts:");
  console.log("=====================================");
  users.forEach((user) => {
    console.log(`\n${user.role}:`);
    console.log(`  Username: ${user.username}`);
    console.log(`  Password: ${user.password}`);
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
