import { PrismaClient, TaskStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("TaskFlow123!", 10);

  const demoUser = await prisma.user.create({
    data: {
      name: "Alex Morgan",
      email: "demo@taskflow.dev",
      passwordHash,
    },
  });

  const today = new Date();
  const plusDays = (days: number) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() + days);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  };

  await prisma.task.createMany({
    data: [
      {
        userId: demoUser.id,
        title: "Prepare engineering assessment submission",
        description:
          "Review the implementation, verify the README, and make sure the repository is ready to share.",
        status: TaskStatus.IN_PROGRESS,
        dueDate: plusDays(2),
      },
      {
        userId: demoUser.id,
        title: "Review API error handling",
        description:
          "Confirm validation failures, missing resources, and database errors return clear responses.",
        status: TaskStatus.TODO,
        dueDate: plusDays(4),
      },
      {
        userId: demoUser.id,
        title: "Polish dashboard responsive states",
        description:
          "Check mobile spacing, empty states, filters, loading states, and long task titles.",
        status: TaskStatus.COMPLETED,
        dueDate: plusDays(-1),
      },
      {
        userId: demoUser.id,
        title: "Client presentation deck",
        description:
          "Draft the slides covering system architecture, security considerations, and UX metrics.",
        status: TaskStatus.TODO,
        dueDate: plusDays(1),
      },
      {
        userId: demoUser.id,
        title: "Finalize end-to-end integration tests",
        description:
          "Test user registration, login flow, task creation, and route protections.",
        status: TaskStatus.IN_PROGRESS,
        dueDate: plusDays(3),
      },
    ],
  });

  console.log(`Seeded demo user: ${demoUser.email} (Password: TaskFlow123!)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
