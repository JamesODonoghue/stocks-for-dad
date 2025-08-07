"use client";
import { api } from "~/trpc/react";
import NewGameForm from "./new-game-form";
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
export default function NewGame() {
  const { data } = api.team.getAll.useQuery();
  if (!data) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  return (
    <Suspense>
      <NewGameForm teams={data}></NewGameForm>
    </Suspense>
  );
}
