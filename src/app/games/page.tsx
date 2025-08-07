"use client";
import GameCard from "./games-list";
import { buttonVariants } from "~/components/ui/button";
import Link from "next/link";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
export const dynamic = "force-dynamic";
export default function Games() {
  const { data: games, isError } = api.game.getAll.useQuery();
  if (isError) {
    return <div>Error fetching games</div>;
  }
  if (!games) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
        <div className="flex justify-end">
          <Skeleton className="h-12 w-36" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 p-4">
      <div className="flex justify-end">
        <Link
          className={buttonVariants({ variant: "default" })}
          href="/games/new"
        >
          Create Game
        </Link>
      </div>
      {games.map(({ id, homeTeam, awayTeam, createdAt }) => (
        <GameCard
          key={id}
          id={id}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          createdAt={createdAt}
        />
      ))}
    </div>
  );
}
