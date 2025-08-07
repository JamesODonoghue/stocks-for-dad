import { db } from "~/server/db";
import PlayerCard from "./player-card";
export default async function Players() {
  const response = await db.player.findMany({ include: { team: true } });

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 p-4">
      {!response.length && (
        <div className="flex justify-center">No players created</div>
      )}
      {response.map(({ id, name, team }) => (
        <PlayerCard key={id} id={id} name={name} team={team} />
      ))}
    </div>
  );
}
