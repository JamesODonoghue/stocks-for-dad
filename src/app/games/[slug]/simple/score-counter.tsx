"use client";
import { Minus, Plus } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useState } from "react";
import {
  decrementAwayTeamScore,
  decrementHomeTeamScore,
  incrementAwayTeamScore,
  incrementHomeTeamScore,
} from "~/app/games/[slug]/_actions";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function ScoreCounter({
  id,
  homeTeamScore,
  awayTeamScore,
  homeTeam,
  awayTeam,
}: {
  id: number;
  homeTeamScore: number;
  awayTeamScore: number;
  homeTeam: string;
  awayTeam: string;
}) {
  const [localHomeTeamScore, setHomeTeamScore] =
    useState<number>(homeTeamScore);
  const [localAwayTeamScore, setAwayTeamScore] =
    useState<number>(awayTeamScore);
  return (
    <div className=" mx-auto flex max-w-xl flex-col gap-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle>{homeTeam}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8 text-9xl font-bold">
            <Button
              onClick={async () => {
                setHomeTeamScore(localHomeTeamScore - 1);
                await decrementHomeTeamScore({ id });
              }}
              disabled={localHomeTeamScore === 0}
              variant="outline"
              size="iconLarge"
            >
              <Minus size={36} />
            </Button>
            <div className="w-36 text-center">{localHomeTeamScore}</div>
            <Button
              onClick={async () => {
                setHomeTeamScore(localHomeTeamScore + 1);
                await incrementHomeTeamScore({ id });
              }}
              variant="outline"
              size="iconLarge"
            >
              <Plus size={36} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{awayTeam}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8 text-9xl font-bold">
            <Button
              variant="outline"
              size="iconLarge"
              disabled={localAwayTeamScore === 0}
              onClick={async () => {
                setAwayTeamScore(localAwayTeamScore - 1);
                await decrementAwayTeamScore({ id });
              }}
            >
              <Minus size={36} />
            </Button>
            <div className="w-36 text-center">{localAwayTeamScore}</div>
            <Button
              variant="outline"
              size="iconLarge"
              onClick={async () => {
                setAwayTeamScore(localAwayTeamScore + 1);
                await incrementAwayTeamScore({ id });
              }}
            >
              <Plus size={36} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
