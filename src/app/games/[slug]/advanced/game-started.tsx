"use client";
import { Button, buttonVariants } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type PointPlayer, type Player, type Prisma } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useFormCustom } from "~/hooks/useForm";
import {
  addAssist,
  addBlock,
  addGoal,
  addTurnover,
  createPlayer,
  createPointPlayer,
  deletePointPlayer,
  endPoint,
  incrementAwayTeamScore,
  incrementHomeTeamScore,
  resetPointPlayerStats,
  startPoint,
} from "../_actions";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Badge } from "~/components/ui/badge";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";

type GameWithTeamsAndPoints = Prisma.GameGetPayload<{
  include: {
    homeTeam: true;
    awayTeam: true;
    points: { include: { players: true } };
  };
}>;
export default function GameStarted({
  homeTeam: { name: homeTeamName },
  awayTeam: { name: awayTeamName },
  homeTeamScore,
  awayTeamScore,
  homeTeamId,
  players,
  points,
  id: gameId,
}: GameWithTeamsAndPoints & { players: Player[] }) {
  const formSchema = z.object({
    playerName: z.string().min(2, {
      message: "Player name must be at least 2 characters.",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playerName: "",
    },
  });
  const { formState } = form;
  const { isValid } = formState;
  const [listOfPlayers, setListOfPlayers] = useState<
    {
      id: number;
      name: string;
      checked: boolean;
      pointPlayer: PointPlayer | undefined;
    }[]
  >([]);

  const { formAction: addPlayerFormAction, onSubmit: addPlayerOnSubmit } =
    useFormCustom(createPlayer, null);
  const latestPoint = points.at(-1);
  useEffect(() => {
    if (!latestPoint) {
      return setListOfPlayers([]);
    }
    const { players: currentPointPlayers } = latestPoint;
    const gamePlayers = players.map(({ name, id }) => {
      return {
        id,
        name,
        pointPlayer: currentPointPlayers.find(
          (currentPointPlayer) => currentPointPlayer.playerId === id,
        ),
        checked: !!currentPointPlayers.find(
          (currentPointPlayer) => currentPointPlayer.playerId === id,
        )?.id,
      };
    });
    setListOfPlayers(gamePlayers);
  }, [players, latestPoint]);

  if (!latestPoint) {
    return <div>No active point</div>;
  }

  async function handleChangePlayerCheckbox({
    checked,
    id,
    pointId,
    pointPlayerId,
  }: {
    checked: string | boolean;
    id: number;
    pointId: number;
    pointPlayerId: number | undefined;
  }) {
    if (checked) {
      return await createPointPlayer({ playerId: id, pointId, gameId });
    }
    if (pointPlayerId) {
      await deletePointPlayer({ id: pointPlayerId });
    }
  }

  async function handleClickStartPoint({ id }: { id: number }) {
    await startPoint(id);
  }

  async function handleClickAwayTeamAddGoal({
    pointId,
    gameId,
  }: {
    pointId: number;
    gameId: number;
  }) {
    await incrementAwayTeamScore({ id: gameId });
    await endPoint({ id: pointId, gameId });
  }

  async function handleClickAddBlock({ id }: { id: number }) {
    await addBlock({ id });
  }
  async function handleClickAddTurnover({ id }: { id: number }) {
    await addTurnover({ id });
  }

  async function handleChangePlayerStat({
    event,
    pointPlayerId,
    gameId,
  }: {
    event: string;
    pointPlayerId: number;
    gameId: number;
  }) {
    if (event === "assist") {
      return await addAssist({ id: pointPlayerId });
    }
    if (event === "goal") {
      await incrementHomeTeamScore({ id: gameId });
      return await addGoal({ id: pointPlayerId });
    }
    return await resetPointPlayerStats({ id: pointPlayerId });
  }

  async function handleClickEndPoint({
    id,
    gameId,
  }: {
    id: number;
    gameId: number;
  }) {
    await endPoint({ id, gameId });
  }

  return (
    <div className=" mx-auto flex max-w-xl flex-col gap-4 p-4">
      <div className="flex w-full justify-end">
        <Link
          className={buttonVariants({ variant: "link" })}
          href="advanced/stats"
        >
          View Game Stats
        </Link>
      </div>

      <Card>
        <CardHeader className="gap-2 space-y-0">
          <CardTitle className="flex justify-between text-lg">
            <div className="flex gap-4">
              <div>{homeTeamName}</div>
              <div>{homeTeamScore}</div>
            </div>
            <div className="flex gap-4">
              <div>{awayTeamName}</div>
              <div>{awayTeamScore}</div>
            </div>
          </CardTitle>
          <div className="flex justify-between">
            {latestPoint.status === "READY" ? (
              <div>
                <Badge className="inline-flex">Point Ready</Badge>
              </div>
            ) : latestPoint.status === "STARTED" ? (
              <div>
                <Badge className="inline-flex">Point In Progress</Badge>
              </div>
            ) : (
              <></>
            )}

            {latestPoint.status === "STARTED" ? (
              <Button
                onClick={() =>
                  handleClickEndPoint({ id: latestPoint.id, gameId })
                }
              >
                End Point
              </Button>
            ) : latestPoint.status === "READY" ? (
              <Button
                disabled={latestPoint.players.length !== 1}
                onClick={() => handleClickStartPoint({ id: latestPoint.id })}
              >
                Start Point
              </Button>
            ) : (
              <></>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {latestPoint.status === "READY" ? (
            <div className="flex flex-col gap-5">
              <CardTitle>Select your players for this point</CardTitle>
              {listOfPlayers.map(({ name, id, checked, pointPlayer }) => (
                <div className="flex items-center justify-between" key={id}>
                  <div className="flex gap-4">
                    <Checkbox
                      value={id}
                      id={id.toString()}
                      className="flex items-center justify-between"
                      checked={checked}
                      onCheckedChange={async (event) => {
                        setListOfPlayers(
                          listOfPlayers.map((player) => {
                            if (player.id === id) {
                              return { ...player, checked: !!event };
                            }
                            return player;
                          }),
                        );
                        await handleChangePlayerCheckbox({
                          checked: event,
                          id,
                          pointId: latestPoint.id,
                          pointPlayerId: pointPlayer?.id,
                        });
                      }}
                    />
                    <Label htmlFor={id.toString()}>{name}</Label>
                  </div>
                </div>
              ))}
              <Form {...form}>
                <form
                  action={addPlayerFormAction}
                  onSubmit={(event) => {
                    addPlayerOnSubmit(event);
                    form.reset();
                  }}
                  className="flex flex-col gap-4"
                >
                  <input hidden defaultValue={homeTeamId} name="teamId" />
                  <input hidden defaultValue={latestPoint.id} name="pointId" />
                  <input hidden defaultValue={gameId} name="gameId" />
                  <FormField
                    control={form.control}
                    name="playerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Player Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  ></FormField>
                  <Button disabled={!isValid} variant="secondary" type="submit">
                    Add Player
                  </Button>
                </form>
              </Form>
            </div>
          ) : latestPoint.status === "STARTED" ? (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <Drawer>
                  <CardTitle>{homeTeamName}</CardTitle>
                  {/* <DrawerTrigger
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Add Goal
                  </DrawerTrigger> */}
                  {listOfPlayers
                    .filter((player) => player.checked)
                    .map(({ name, id, pointPlayer }) => {
                      if (!pointPlayer) {
                        return <></>;
                      }
                      return (
                        <Card key={id}>
                          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0">
                            <div>{name}</div>
                            <div className="my-0 flex items-baseline gap-4">
                              <Badge variant="secondary">
                                {pointPlayer.blocks} blocks
                              </Badge>
                              <Badge variant="secondary">
                                {pointPlayer.turnovers} turnovers
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col gap-2">
                              <ToggleGroup
                                className="flex gap-2"
                                type="single"
                                defaultValue={
                                  !!pointPlayer?.assists
                                    ? "assist"
                                    : !!pointPlayer?.goals
                                      ? "goal"
                                      : ""
                                }
                                onValueChange={(event) =>
                                  handleChangePlayerStat({
                                    event,
                                    pointPlayerId: pointPlayer.id,
                                    gameId,
                                  })
                                }
                              >
                                <ToggleGroupItem
                                  className={`${buttonVariants({
                                    variant: "outline",
                                  })} w-full`}
                                  value="assist"
                                >
                                  Assist
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                  className={`${buttonVariants({
                                    variant: "outline",
                                  })} w-full`}
                                  value="goal"
                                >
                                  Goal
                                </ToggleGroupItem>
                              </ToggleGroup>
                              <div className="flex gap-2">
                                <Button
                                  className="flex w-full gap-2"
                                  variant="outline"
                                  onClick={() =>
                                    handleClickAddBlock({
                                      id: pointPlayer.id,
                                    })
                                  }
                                >
                                  Block
                                </Button>
                                <Button
                                  className="flex w-full gap-2"
                                  variant="outline"
                                  onClick={() =>
                                    handleClickAddTurnover({
                                      id: pointPlayer.id,
                                    })
                                  }
                                >
                                  Turnover
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>Add Goal</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex flex-col gap-2 p-4">
                      {listOfPlayers
                        .filter(({ pointPlayer }) => pointPlayer)
                        .map(({ name, id, pointPlayer }) => (
                          <div
                            className="flex items-center justify-between"
                            key={id}
                          >
                            <div className="flex w-full items-center justify-between gap-4">
                              <div>{name}</div>
                              <ToggleGroup
                                className="flex gap-2"
                                type="single"
                                defaultValue={
                                  !!pointPlayer?.assists
                                    ? "assist"
                                    : !!pointPlayer?.goals
                                      ? "goal"
                                      : ""
                                }
                                onValueChange={(event) =>
                                  handleChangePlayerStat({
                                    event,
                                    pointPlayerId: pointPlayer!.id,
                                    gameId,
                                  })
                                }
                              >
                                <ToggleGroupItem
                                  variant="outline"
                                  value="assist"
                                >
                                  Assist
                                </ToggleGroupItem>
                                <ToggleGroupItem variant="outline" value="goal">
                                  Goal
                                </ToggleGroupItem>
                              </ToggleGroup>
                            </div>
                          </div>
                        ))}
                    </div>
                    <DrawerFooter>
                      <DrawerClose
                        className={buttonVariants({ variant: "default" })}
                        onClick={() =>
                          handleClickEndPoint({ id: latestPoint.id, gameId })
                        }
                      >
                        End Point
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
              <div className="flex w-full flex-col gap-4">
                <CardTitle>{awayTeamName}</CardTitle>
                <Button
                  variant="outline"
                  onClick={() =>
                    handleClickAwayTeamAddGoal({
                      gameId,
                      pointId: latestPoint.id,
                    })
                  }
                >
                  Add Goal
                </Button>
              </div>
            </div>
          ) : (
            <></>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
