import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { db } from "~/server/db";
export default async function GameStats({
  params,
}: {
  params: { slug: string };
}) {
  const pointPlayers = await db.pointPlayer.groupBy({
    by: ["playerId"],
    where: { gameId: parseInt(params.slug) },
    _sum: { assists: true, goals: true },
  });
  const allPlayers = await db.player.findMany();
  const list = allPlayers.map((player) => {
    const pointPlayer = pointPlayers.find(
      (pointPlayer) => pointPlayer.playerId === player.id,
    );

    return {
      ...player,
      assists: pointPlayer?._sum.assists,
      goals: pointPlayer?._sum.goals,
    };
  });
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
      <div className="flex w-full justify-end">
        <Link
          className={buttonVariants({ variant: "link" })}
          href="../advanced"
        >
          View Game
        </Link>
      </div>
      {!list.length ? (
        <div className="flex justify-center">No stats</div>
      ) : (
        <Table>
          <TableCaption>List of player stats</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>A</TableHead>
              <TableHead>G</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {list.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.assists}</TableCell>
                <TableCell>{item.goals}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
      )}
    </div>
  );
}
