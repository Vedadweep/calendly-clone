import "server-only";

import path from "node:path";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
  databaseReady?: Promise<void>;
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
  if (!globalForPrisma.databaseReady) {
    globalForPrisma.databaseReady = (async () => {
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

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Availability" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "dayOfWeek" INTEGER NOT NULL,
          "enabled" BOOLEAN NOT NULL DEFAULT false,
          "startTime" TEXT NOT NULL,
          "endTime" TEXT NOT NULL,
          "timezone" TEXT NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Availability_dayOfWeek_key"
        ON "Availability"("dayOfWeek")
      `);

      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "Booking" (
          "id" TEXT NOT NULL PRIMARY KEY,
          "guestName" TEXT NOT NULL,
          "guestEmail" TEXT NOT NULL,
          "startTime" DATETIME NOT NULL,
          "endTime" DATETIME NOT NULL,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "eventTypeId" TEXT NOT NULL,
          CONSTRAINT "Booking_eventTypeId_fkey"
            FOREIGN KEY ("eventTypeId") REFERENCES "EventType" ("id")
            ON DELETE CASCADE ON UPDATE CASCADE
        )
      `);

      await prisma.$executeRawUnsafe(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Booking_startTime_key"
        ON "Booking"("startTime")
      `);
    })();
  }

  await globalForPrisma.databaseReady;
}
