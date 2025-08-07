"use client";
import { Button } from "../../../../components/ui/button";
import { startGame } from "~/app/games/[slug]/_actions";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type Prisma } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { useFormCustom } from "~/hooks/useForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";

type GameWithTeamsAndPoints = Prisma.GameGetPayload<{
  include: { homeTeam: true; awayTeam: true; points: true };
}>;
export default function GameDetail({
  homeTeam: { name: homeTeamName },
  awayTeam: { name: awayTeamName },
  id,
}: GameWithTeamsAndPoints) {
  const form = useForm();
  const { formAction, onSubmit } = useFormCustom(startGame, null);

  return (
    <div className=" mx-auto flex max-w-xl flex-col gap-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {homeTeamName} vs {awayTeamName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={formAction} onSubmit={onSubmit}>
              <div className="flex flex-col gap-8">
                <input hidden name="id" defaultValue={id} />
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="startingOffense"
                    defaultValue={homeTeamName}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-4">
                        <FormLabel>Starting Offense</FormLabel>
                        <FormControl>
                          <RadioGroup
                            {...field}
                            onValueChange={field.onChange}
                            defaultValue={field.value as string}
                            className="flex flex-col gap-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={homeTeamName} />
                              </FormControl>
                              <FormLabel>{homeTeamName}</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={awayTeamName} />
                              </FormControl>
                              <FormLabel>{awayTeamName}</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <Button type="submit" className="w-full">
                  Start Game
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
