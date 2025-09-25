import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Nettoyage complet
  await prisma.notification.deleteMany();
  await prisma.historique.deleteMany();
  await prisma.todoShare.deleteMany();
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();

  // USERS
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
  const createdUsers = [];
  for (const user of users) {
    const u = await prisma.user.create({ data: user });
    createdUsers.push(u);
  }

  // TODOS
  const todos = [
    {
      title: 'Learn TypeScript',
      description: 'Apprendre les bases de TS',
      imageUrl: '/assets/IMG_E5839.JPG',
      audioUrl: '/audio/1758712887807-458939652.webm',
      completed: false,
      archived: false,
      startDate: new Date(),
      endDate: new Date(),
      userId: createdUsers[0].id,
    },
    {
      title: 'Build a Node.js API',
      description: 'Créer une API REST',
      imageUrl: '/assets/IMG_1036.JPG',
      audioUrl: '/audio/1758713014629-894913756.webm',
      completed: false,
      archived: false,
      startDate: new Date(),
      endDate: new Date(),
      userId: createdUsers[1].id,
    },
    {
      title: 'Write documentation',
      description: 'Rédiger la doc',
      imageUrl: '/assets/1756577816678.jpeg',
      audioUrl: null,
      completed: true,
      archived: false,
      startDate: new Date(),
      endDate: new Date(),
      userId: createdUsers[2].id,
    },
  ];
  const createdTodos = [];
  for (const todo of todos) {
    const t = await prisma.todo.create({ data: todo });
    createdTodos.push(t);
  }

  // TODO SHARES
  await prisma.todoShare.createMany({
    data: [
      {
        todoId: createdTodos[0].id,
        userId: createdUsers[1].id,
        canEdit: true,
        canDelete: false,
      },
      {
        todoId: createdTodos[1].id,
        userId: createdUsers[2].id,
        canEdit: false,
        canDelete: true,
      },
    ],
  });

  // HISTORIQUE
  await prisma.historique.createMany({
    data: [
      {
        userId: createdUsers[0].id,
        action: 'CREATE',
        todoId: createdTodos[0].id,
        timestamp: new Date(),
      },
      {
        userId: createdUsers[1].id,
        action: 'CREATE',
        todoId: createdTodos[1].id,
        timestamp: new Date(),
      },
      {
        userId: createdUsers[2].id,
        action: 'CREATE',
        todoId: createdTodos[2].id,
        timestamp: new Date(),
      },
    ],
  });

  // NOTIFICATIONS
  await prisma.notification.createMany({
    data: [
      {
        userId: createdUsers[0].id,
        todoId: createdTodos[0].id,
        message: 'Votre todo a été créé',
        read: false,
      },
      {
        userId: createdUsers[1].id,
        todoId: createdTodos[1].id,
        message: 'Votre todo a été partagé',
        read: false,
      },
    ],
  });

  console.log('Seed complet inséré');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
