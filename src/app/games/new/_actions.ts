"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

export async function createGame(formData: {
  homeTeamId: string;
  awayTeamId: string;
}) {
  const { homeTeamId, awayTeamId } = formData;
  if (!homeTeamId) {
    throw new Error("Home team must be defined");
  }
  if (!awayTeamId) {
    throw new Error("Home team must be defined");
  }
  const { id } = await db.game.create({
    data: {
      homeTeamId: parseInt(homeTeamId),
      awayTeamId: parseInt(awayTeamId),
    },
  });
  revalidatePath("games");
  redirect(`/games/${id}/simple`);
}
