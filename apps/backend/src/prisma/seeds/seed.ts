import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany(); 
  await prisma.session.deleteMany();

  const passwordHash = await hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: passwordHash,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@example.com',
      passwordHash: passwordHash,
      name: 'Staff User',
      role: 'STAFF',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      passwordHash: passwordHash,
      name: 'Customer User',
      role: 'CUSTOMER',
    },
  });

  await prisma.session.createMany({
    data: [
      { token: 'session1', userId: admin.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60) },
      { token: 'session2', userId: staff.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60) },
      { token: 'session3', userId: customer.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60) }
    ],
  });

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
