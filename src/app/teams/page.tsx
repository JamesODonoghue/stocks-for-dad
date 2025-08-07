import { db } from "~/server/db";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import TeamCard from "./teams-list";
export default async function Teams() {
  const response = await db.team.findMany({
    orderBy: [{ name: "desc" }],
  });
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 p-4">
      <div className="flex justify-end">
        <Button>
          <Link href="/teams/new">Create Team</Link>
        </Button>
      </div>
      {!response.length && <div>No teams</div>}
      {response.map(({ name, id }) => (
        <TeamCard key={id} name={name} id={id} />
      ))}
    </div>
  );
}
