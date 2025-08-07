import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const teamRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.create({ data: input });
      return team;
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.team.findMany();
  }),
});
