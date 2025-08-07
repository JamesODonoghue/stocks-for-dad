"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";

export async function deleteTeam({ id }: { id: number }) {
  const response = await db.team.delete({
    where: { id },
  });
  revalidatePath("/teams");
  return response;
}
