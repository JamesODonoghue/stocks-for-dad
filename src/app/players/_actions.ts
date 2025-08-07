"use server";

import { revalidatePath } from "next/cache";
import { db } from "~/server/db";

export async function deletePlayer({ id }: { id: number }) {
  const response = await db.player.delete({
    where: { id },
  });
  revalidatePath("/player");
  return response;
}
