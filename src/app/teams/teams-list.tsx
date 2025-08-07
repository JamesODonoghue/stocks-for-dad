"use client";
import { Button } from "~/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { deleteTeam } from "./_actions";

export default function TeamCard({ id, name }: { id: number; name: string }) {
  async function handleClickDelete(id: number) {
    await deleteTeam({ id });
  }
  return (
    <Card key={id}>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button onClick={() => handleClickDelete(id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}
