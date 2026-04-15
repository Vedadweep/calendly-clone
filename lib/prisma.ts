import "server-only";

import path from "node:path";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
  eventTypeTableReady?: Promise<void>;
};

const databaseUrl = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function ensureDatabaseReady() {
  if (!globalForPrisma.eventTypeTableReady) {
    globalForPrisma.eventTypeTableReady = (async () => {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "EventType" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "name" TEXT NOT NULL,
          "slug" TEXT NOT NULL,
          "durationInMinutes" INTEGER NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "EventType_slug_key"
        ON "EventType"("slug")
      `);
    })();
  }

  await globalForPrisma.eventTypeTableReady;
}
