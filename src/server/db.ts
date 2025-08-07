import { PrismaClient } from "@prisma/client";
import { env } from "~/env.js";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
neonConfig.webSocketConstructor = ws;
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // ...(env.NODE_ENV !== "production" && {
    //   datasources: {
    //     db: {
    //       url: env.DATABASE_URL_STAGING,
    //     },
    //   },
    // }),
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
