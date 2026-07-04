import bcrypt from "bcrypt";
import { Role } from "../generated/enums";
import prisma from "../database";


async function main() {
  const password = await bcrypt.hash("password123", 10);

  await prisma.user.createMany({
    data: [
      {
        username: "superadmin",
        email: "superadmin@mail.com",
        passwordHash: password,
        role: Role.superadmin,
      },
      {
        username: "bendahara",
        email: "bendahara@mail.com",
        passwordHash: password,
        role: Role.bendahara,
      },
      {
        username: "kegiatan",
        email: "kegiatan@mail.com",
        passwordHash: password,
        role: Role.admin_kegiatan,
      },
      {
        username: "inventaris",
        email: "inventaris@mail.com",
        passwordHash: password,
        role: Role.admin_inventaris,
      },
    ],
    skipDuplicates: true,
  });

  console.log("🌱 Seed users success!");

  await prisma.donationCategory.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Donasi Umum",
      description: "Kategori donasi untuk keperluan umum (mock untuk testing)",
    },
  });

  console.log("🌱 Seed donation category success!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });