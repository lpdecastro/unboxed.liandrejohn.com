import GamesPageClient from "./GamesPageClient";
import { getGames } from "@/app/actions/games";

export const metadata = {
  title: "Choose Your Games — Unboxed",
  description:
    "Pick your rental dates, check which board games are available, and book your games from Unboxed's Metro Manila collection.",
};

export default async function GamesPage() {
  const games = await getGames();
  return <GamesPageClient games={games} />;
}
