"use client";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { deletePlayer } from "./_actions";
import { type Team } from "@prisma/client";

export default function PlayerCard({
  id,
  name,
  team,
}: {
  id: number;
  name: string;
  team: Team;
}) {
  async function handleClickDelete(id: number) {
    await deletePlayer({ id });
  }
  return (
    <Card key={id}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{team.name}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button onClick={() => handleClickDelete(id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}
