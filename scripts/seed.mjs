// Seeds the local MongoDB database from the JSON fixtures in
// src/data/. Run with: node scripts/seed.mjs
import { readFile } from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import { connectDB } from "../src/lib/mongodb.js";
import Game from "../src/models/Game.js";
import Booking from "../src/models/Booking.js";

const SEED_DIR = path.join(process.cwd(), "src/data");

async function readSeed(file) {
  const raw = await readFile(path.join(SEED_DIR, file), "utf-8");
  return JSON.parse(raw);
}

async function seed() {
  await connectDB();

  const games = await readSeed("games.json");
  const bookings = await readSeed("bookings.json");

  await Game.deleteMany({});
  await Booking.deleteMany({});

  await Game.insertMany(games);
  await Booking.insertMany(bookings);

  console.log(`Seeded ${games.length} games and ${bookings.length} bookings.`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
