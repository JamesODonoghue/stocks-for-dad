import ScoreCounter from "~/app/games/[slug]/simple/score-counter";
import { db } from "~/server/db";
export default async function Game({ params }: { params: { slug: string } }) {
  const response = await db.game.findFirst({
    where: { id: parseInt(params.slug) },
    include: { homeTeam: true, awayTeam: true },
  });
  if (!response) {
    return <div>No data found</div>;
  }
  const {
    homeTeam: { name: homeTeamName },
    awayTeam: { name: awayTeamName },
  } = response;
  return (
    <>
      <ScoreCounter
        {...response}
        homeTeam={homeTeamName}
        awayTeam={awayTeamName}
      />
    </>
  );
}
