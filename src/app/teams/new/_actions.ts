"use server";

import { redirect } from "next/navigation";
import { db } from "~/server/db";

export async function createTeam(formState: null | void, formData: FormData) {
  const teamName = formData.get("teamName") as string;
  if (!teamName) {
    throw new Error("Team name must be defined");
  }
  await db.team.create({
    data: { name: teamName },
  });
  redirect(`/teams`);
}
