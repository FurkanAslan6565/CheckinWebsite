import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  adapter: PrismaPg;
};

function createPrismaClient() {
  const adapter =
    globalForPrisma.adapter ??
    new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 300_000,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.adapter = adapter;
  }

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
