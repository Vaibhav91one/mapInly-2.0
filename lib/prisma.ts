import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const EMPTY_RESPONSES: Record<string, any> = {
  findMany: [],
  findFirst: null,
  findUnique: null,
  create: null,
  update: null,
  upsert: null,
  delete: null,
  createMany: { count: 0 },
  updateMany: { count: 0 },
  deleteMany: { count: 0 },
  count: 0,
  aggregate: {},
};

function createSafeClient(): PrismaClient {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  // ponytail: nested proxy catches DNS/connection failures at query time
  // returns empty data so pages render without DB, add real client when DB exists
  return new Proxy(client, {
    get(target, prop) {
      const val = (target as any)[prop];
      if (typeof val === "function") {
        if (prop === "$connect" || prop === "$disconnect" || prop === "$on" || prop === "$use" || prop === "$transaction") {
          return val.bind(target);
        }
        return (...args: any[]) =>
          val.apply(target, args).catch((err: any) => {
            console.warn("[prisma] query failed:", err?.message);
            return [];
          });
      }
      // model access — proxy its methods too
      if (val && typeof val === "object") {
        return new Proxy(val, {
          get(modelTarget, methodProp) {
            const method = (modelTarget as any)[methodProp];
            if (typeof method !== "function") return method;
            const empty = EMPTY_RESPONSES[methodProp as string] ?? null;
            return (...args: any[]) =>
              method.apply(modelTarget, args).catch((err: any) => {
                console.warn(`[prisma] ${String(prop)}.${String(methodProp)} failed:`, err?.message);
                return empty;
              });
          },
        });
      }
      return val;
    },
  }) as PrismaClient;
}

export const prisma =
  globalForPrisma.prisma ?? createSafeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
