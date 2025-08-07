"use server";
import { revalidatePath } from "next/cache";
import { db } from "../../../server/db";

export async function incrementHomeTeamScore({ id }: { id: number }) {
  const response = await db.game.findUnique({ where: { id } });
  if (!response) {
    return new Error("Not found");
  }
  const { homeTeamScore } = response;
  await db.game.update({
    where: { id },
    data: { homeTeamScore: homeTeamScore + 1 },
  });
}
export async function decrementHomeTeamScore({ id }: { id: number }) {
  const response = await db.game.findUnique({ where: { id } });
  if (!response) {
    return new Error("Not found");
  }
  const { homeTeamScore } = response;
  await db.game.update({
    where: { id },
    data: { homeTeamScore: homeTeamScore - 1 },
  });
}

export async function incrementAwayTeamScore({ id }: { id: number }) {
  const response = await db.game.findUnique({ where: { id } });
  if (!response) {
    return new Error("Not found");
  }
  const { awayTeamScore } = response;
  await db.game.update({
    where: { id },
    data: { awayTeamScore: awayTeamScore + 1 },
  });
}
export async function decrementAwayTeamScore({ id }: { id: number }) {
  const response = await db.game.findUnique({ where: { id } });
  if (!response) {
    return new Error("Not found");
  }
  const { awayTeamScore } = response;
  await db.game.update({
    where: { id },
    data: { awayTeamScore: awayTeamScore - 1 },
  });
}

export async function startGame(formState: null | void, formData: FormData) {
  const startingOffense = formData.get("startingOffense") as string;
  const id = formData.get("id") as string;
  await db.game.update({
    where: { id: parseInt(id) },
    data: { status: "STARTED", startingOffense },
  });
  await db.point.create({
    data: { gameId: parseInt(id) },
  });
  revalidatePath("/game");
}

export async function createPlayer(formState: null | void, formData: FormData) {
  const name = formData.get("playerName") as string;
  const teamId = parseInt(formData.get("teamId") as string);
  const pointId = parseInt(formData.get("pointId") as string);
  const gameId = parseInt(formData.get("gameId") as string);
  const { id: playerId } = await db.player.create({
    data: { name, teamId },
  });
  await db.pointPlayer.create({
    data: { pointId, playerId, gameId },
  });
  revalidatePath("/game");
  revalidatePath("/player");
}

export async function deletePlayer(id: number) {
  await db.player.delete({
    where: { id },
  });
  revalidatePath("/player");
}

export async function startPoint(id: number) {
  const res = await db.point.update({
    where: { id },
    data: { status: "STARTED" },
  });
  console.log("updating point to started", res.id);
  revalidatePath("/game");
}
export async function endPoint({ id, gameId }: { id: number; gameId: number }) {
  const completedPoint = await db.point.update({
    where: { id },
    data: { status: "COMPLETED" },
  });
  console.log("updated point to completed", completedPoint.id);
  const res = await db.point.create({
    data: { gameId },
  });
  console.log("creating new point", res.id);
  revalidatePath("/game");
}

export async function createPointPlayer({
  playerId,
  pointId,
  gameId,
}: {
  playerId: number;
  pointId: number;
  gameId: number;
}) {
  await db.pointPlayer.create({
    data: { playerId, pointId, gameId },
  });
  revalidatePath("/player");
}

export async function deletePointPlayer({ id }: { id: number }) {
  await db.pointPlayer.delete({
    where: { id },
  });
  revalidatePath("/player");
}

export async function addBlock({ id }: { id: number }) {
  const pointPlayer = await db.pointPlayer.findFirst({
    where: { id },
  });
  if (!pointPlayer) {
    return;
  }
  await db.pointPlayer.update({
    where: { id },
    data: { blocks: pointPlayer.blocks ? pointPlayer.blocks + 1 : 1 },
  });
  revalidatePath("/pointPlayer");
}

export async function addTurnover({ id }: { id: number }) {
  const pointPlayer = await db.pointPlayer.findFirst({
    where: { id },
  });
  if (!pointPlayer) {
    return;
  }
  await db.pointPlayer.update({
    where: { id },
    data: { turnovers: pointPlayer.turnovers ? pointPlayer.turnovers + 1 : 1 },
  });
  revalidatePath("/pointPlayer");
}

export async function addAssist({ id }: { id: number }) {
  await db.pointPlayer.update({
    where: { id },
    data: { assists: 1, goals: 0 },
  });
  revalidatePath("/game");
}

export async function addGoal({ id }: { id: number }) {
  await db.pointPlayer.update({
    where: { id },
    data: { goals: 1, assists: 0 },
  });
  revalidatePath("/game");
}

export async function resetPointPlayerStats({ id }: { id: number }) {
  await db.pointPlayer.update({
    where: { id },
    data: { goals: 0, assists: 0 },
  });
  revalidatePath("/game");
}
