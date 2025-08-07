import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const gameRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        homeTeamId: z.string(),
        awayTeamId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { homeTeamId, awayTeamId } }) => {
      const game = await ctx.db.game.create({
        data: {
          homeTeamId: parseInt(homeTeamId),
          awayTeamId: parseInt(awayTeamId),
        },
      });
      return game;
    }),
  update: publicProcedure
    .input(
      z.object({
        homeTeamScore: z.number(),
        awayTeamScore: z.number(),
        id: z.string(),
      }),
    )
    .mutation(({ ctx, input: { homeTeamScore, awayTeamScore, id } }) => {
      return ctx.db.game.update({
        where: { id: parseInt(id) },
        data: { homeTeamScore, awayTeamScore },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.game.findMany({
      include: { homeTeam: true, awayTeam: true },
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input: { id } }) =>
      ctx.db.game.findUnique({
        where: { id: parseInt(id) },
        include: { homeTeam: true, awayTeam: true },
      }),
    ),
});
