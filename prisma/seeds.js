import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hashage des mots de passe
  const users = [
    {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin',
      role: 'ADMIN',
      imageUrl: '/assets/IMG_E5839.JPG',
    },
    {
      email: 'user1@example.com',
      password: await bcrypt.hash('user123', 10),
      name: 'User One',
      role: 'USER',
      imageUrl: '/assets/IMG_1036.JPG',
    },
    {
      email: 'user2@example.com',
      password: await bcrypt.hash('user456', 10),
      name: 'User Two',
      role: 'USER',
      imageUrl: '/assets/1756577816678.jpeg',
    },
  ];
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: user.password,
        name: user.name,
        role: user.role,
        imageUrl: user.imageUrl,
      },
      create: user,
    });
  }

  await prisma.todo.createMany({
    data: [
      {
        title: 'Learn TypeScript',
        completed: false,
        userId: 1,
      },
      {
        title: 'Build a Node.js API',
        completed: false,
        userId: 2,
      },
      {
        title: 'Write documentation',
        completed: true,
        userId: 3,
      },
    ],
  });
  console.log('Seed data inserted');
}
  await prisma.historique.createMany({
    data: [
      {
        userId: 1,
        action: 'CREATE',
        todoId: 1,
        timestamp: new Date(),
      },
      {
        userId: 2,
        action: 'CREATE',
        todoId: 2,
        timestamp: new Date(),
      },
      {
        userId: 3,
        action: 'CREATE',
        todoId: 3,
        timestamp: new Date(),
      },
    ],
  });

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
