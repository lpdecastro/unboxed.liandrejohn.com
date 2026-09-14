"use server";

import { connectDB } from "@/lib/mongodb";
import Game from "@/models/Game";
import Booking from "@/models/Booking";

// Bookings in these statuses hold a game unavailable for its dates.
// `pending` bookings don't block availability until manually confirmed.
const BLOCKING_STATUSES = [
  "confirmed",
  "out-for-delivery",
  "rented",
  "return-pending",
];

function toCardShape(game) {
  return {
    slug: game.slug,
    name: game.name,
    shortDescription: game.shortDescription,
    description: game.description,
    howToPlay: game.howToPlay,
    imageSrc: game.imageUrl ?? null,
    imageAlt: game.imageUrl ? `${game.name} game box` : null,
    icon: game.icon ?? null,
    placeholderBg: game.placeholderBg ?? null,
    players: game.players,
    playTime: game.playTime,
    age: game.age,
    pricePerDay: game.pricePerDay,
    deposit: game.deposit,
    lateFeePerDay: game.lateFeePerDay,
  };
}

export async function getGames() {
  await connectDB();
  const games = await Game.find({ active: true }).lean();
  return games.map(toCardShape);
}

export async function checkAvailability(startDate, endDate) {
  await connectDB();

  const start = new Date(startDate);
  const end = new Date(endDate);

  const games = await Game.find({ active: true }).select("slug").lean();
  const blockingBookings = await Booking.find({
    status: { $in: BLOCKING_STATUSES },
    startDate: { $lte: end },
    endDate: { $gte: start },
  })
    .select("games")
    .lean();

  const blockedGameIds = new Set(
    blockingBookings.flatMap((booking) => booking.games.map(String))
  );

  const availability = {};
  games.forEach((game) => {
    availability[game.slug] = !blockedGameIds.has(String(game._id));
  });
  return availability;
}
