import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const stockRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        symbol: z.string().min(1).max(10),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input: { symbol, name } }) => {
      const stock = await ctx.db.stock.create({
        data: {
          symbol: symbol.toUpperCase(),
          name,
        },
      });
      return stock;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        symbol: z.string().min(1).max(10).optional(),
        name: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input: { id, symbol, name } }) => {
      return ctx.db.stock.update({
        where: { id: parseInt(id) },
        data: {
          ...(symbol && { symbol: symbol.toUpperCase() }),
          ...(name && { name }),
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input: { id } }) => {
      return ctx.db.stock.delete({
        where: { id: parseInt(id) },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.stock.findMany({
      orderBy: { symbol: "asc" },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input: { id } }) =>
      ctx.db.stock.findUnique({
        where: { id: parseInt(id) },
      }),
    ),

  getBySymbol: publicProcedure
    .input(z.object({ symbol: z.string() }))
    .query(({ ctx, input: { symbol } }) =>
      ctx.db.stock.findUnique({
        where: { symbol: symbol.toUpperCase() },
      }),
    ),

  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(({ ctx, input: { query } }) =>
      ctx.db.stock.findMany({
        where: {
          OR: [
            { symbol: { contains: query.toUpperCase(), mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } },
          ],
        },
        orderBy: { symbol: "asc" },
      }),
    ),
});
