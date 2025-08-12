import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed minimal org and admin user to satisfy foreign keys
  const org = await prisma.organization.upsert({
    where: { id: 'org-seed' },
    update: {},
    create: { id: 'org-seed', name: 'Seed Org', subdomain: 'seed-org' },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      organizationId: org.id,
      email: 'admin@example.com',
      passwordHash: 'placeholder',
      firstName: 'Admin',
      lastName: 'User',
    },
  });

  const hostel = await prisma.hostel.create({
    data: { organizationId: org.id, name: 'Downtown Hostel', address: '123 Main St', totalBeds: 0 },
  });

  const room201 = await prisma.room.create({
    data: { hostelId: hostel.id, roomNumber: '201', floor: '2', roomType: 'DOUBLE', capacity: 2 },
  });

  await prisma.bed.createMany({
    data: [
      { roomId: room201.id, bedNumber: '201-A', status: 'VACANT', monthlyRent: 10000 },
      { roomId: room201.id, bedNumber: '201-B', status: 'VACANT', monthlyRent: 10000 },
    ],
  });

  await prisma.notice.create({
    data: { hostelId: hostel.id, createdBy: admin.id, title: 'Welcome', content: 'Welcome to the hostel admin!', priority: 'MEDIUM' },
  });

  console.log('Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

