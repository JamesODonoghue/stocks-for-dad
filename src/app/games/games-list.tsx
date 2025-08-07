"use client";
import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { deleteGame } from "./_actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function GameCard({
  id,
  homeTeam,
  awayTeam,
  createdAt,
}: {
  id: number;
  homeTeam: { id: number; name: string };
  awayTeam: { id: number; name: string };
  createdAt: Date;
}) {
  async function handleClickDelete(id: number) {
    await deleteGame({ id });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {homeTeam.name} vs {awayTeam.name}
        </CardTitle>
        <CardDescription>
          {createdAt.toLocaleString("en-us", {
            timeZone: "America/Los_Angeles",
          })}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex w-full flex-col gap-4">
        <div className="flex w-full justify-end gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "secondary" })}
            >
              More
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link href={`games/${id}/advanced`}>View advanced</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleClickDelete(id)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            className={`${buttonVariants({ variant: "default" })}`}
            href={`games/${id}/simple`}
          >
            View simple
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
