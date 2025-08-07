"use client";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const pathname = usePathname();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start justify-between gap-4 p-4">
      <div className="flex w-full justify-between">
        <h1 className="text-4xl font-bold">Ulti score</h1>
      </div>
      <Tabs
        defaultValue="/games"
        value={pathname.split("/")[1]}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <Link className="w-full" href="/games">
            <TabsTrigger className="w-full" value="games">
              Games
            </TabsTrigger>
          </Link>
          <Link className="w-full" href="/teams">
            <TabsTrigger className="w-full" value="teams">
              Teams
            </TabsTrigger>
          </Link>
          <Link className="w-full" href="/players">
            <TabsTrigger className="w-full" value="players">
              Players
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
}
