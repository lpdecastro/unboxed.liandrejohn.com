import GamesPageClient from "./GamesPageClient";
import { getGames } from "@/app/actions/games";

export const metadata = {
  title: "Choose Your Games — Unboxed",
  description:
    "Pick your rental dates, check which board games are available, and book your games from Unboxed's Metro Manila collection.",
};

export default async function GamesPage({ searchParams }) {
  const games = await getGames();
  const params = await searchParams;
  const initialAddSlug =
    typeof params?.add === "string" ? params.add : undefined;
  return <GamesPageClient games={games} initialAddSlug={initialAddSlug} />;
}
