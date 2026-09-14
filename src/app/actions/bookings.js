"use server";

import { connectDB } from "@/lib/mongodb";
import Game from "@/models/Game";
import Booking from "@/models/Booking";
import { peso, formatDate } from "@/lib/format";

// Bookings in these statuses hold a game unavailable for its dates.
// `pending` bookings don't block availability until manually confirmed.
const BLOCKING_STATUSES = [
  "confirmed",
  "out-for-delivery",
  "rented",
  "return-pending",
];

const MOBILE_REGEX = /^(09|\+639)\d{9}$/;

const MAX_RENTAL_DAYS = 7;

function todayISODate() {
  return new Date().toISOString().slice(0, 10);
}

function rentalDaysBetween(startDate, endDate) {
  return (
    Math.round(
      (new Date(endDate) - new Date(startDate)) / (24 * 60 * 60 * 1000)
    ) + 1
  );
}

async function generateBookingNumber() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = `BG-${Math.floor(1000 + Math.random() * 9000)}`;
    const exists = await Booking.exists({ bookingNumber: candidate });
    if (!exists) return candidate;
  }
  throw new Error("Could not generate a unique booking number.");
}

export async function createBooking(input) {
  const {
    slugs = [],
    startDate,
    endDate,
    customer = {},
    gcashReferenceNumber,
  } = input ?? {};
  const { name, mobile, address } = customer;

  if (!Array.isArray(slugs) || slugs.length === 0) {
    return { success: false, error: "Add at least one game to your booking." };
  }
  if (!startDate || startDate < todayISODate()) {
    return { success: false, error: "Start date can't be in the past." };
  }
  if (!endDate || endDate < startDate) {
    return {
      success: false,
      error: "End date must be on or after the start date.",
    };
  }
  if (rentalDaysBetween(startDate, endDate) > MAX_RENTAL_DAYS) {
    return {
      success: false,
      error: `Rentals are limited to a maximum of ${MAX_RENTAL_DAYS} days.`,
    };
  }
  if (!name || !name.trim()) {
    return { success: false, error: "Please enter your full name." };
  }
  const normalizedMobile = (mobile ?? "").replace(/[\s-]/g, "");
  if (!MOBILE_REGEX.test(normalizedMobile)) {
    return {
      success: false,
      error: "Enter a valid Philippine mobile number.",
    };
  }
  if (!address || !address.trim()) {
    return {
      success: false,
      error: "Please enter a complete delivery address.",
    };
  }
  if (!gcashReferenceNumber || !gcashReferenceNumber.trim()) {
    return {
      success: false,
      error: "Please enter your GCash reference number.",
    };
  }

  await connectDB();

  const games = await Game.find({ slug: { $in: slugs }, active: true }).lean();
  if (games.length !== slugs.length) {
    return {
      success: false,
      error: "One or more selected games are no longer available.",
    };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  const blockingBookings = await Booking.find({
    status: { $in: BLOCKING_STATUSES },
    games: { $in: games.map((g) => g._id) },
    startDate: { $lte: end },
    endDate: { $gte: start },
  })
    .select("games")
    .lean();
  const blockedGameIds = new Set(
    blockingBookings.flatMap((booking) => booking.games.map(String))
  );
  const hasUnavailableGame = games.some((g) => blockedGameIds.has(String(g._id)));
  if (hasUnavailableGame) {
    return {
      success: false,
      error:
        "One or more selected games are no longer available for your dates.",
    };
  }

  const rentalDays = rentalDaysBetween(startDate, endDate);
  const rentalSubtotal = games.reduce(
    (sum, g) => sum + g.pricePerDay * rentalDays,
    0
  );
  const discountAmount = games.length >= 2 ? rentalSubtotal * 0.1 : 0;
  const depositTotal = games.reduce((sum, g) => sum + g.deposit, 0);
  const grandTotal = rentalSubtotal - discountAmount + depositTotal;

  const bookingNumber = await generateBookingNumber();

  await Booking.create({
    bookingNumber,
    customer: { name: name.trim(), mobile: normalizedMobile, address: address.trim() },
    startDate: start,
    endDate: end,
    games: games.map((g) => g._id),
    rentalSubtotal,
    discountAmount,
    depositTotal,
    grandTotal,
    gcashReferenceNumber: gcashReferenceNumber.trim(),
    status: "pending",
  });

  return {
    success: true,
    bookingNumber,
    gamesText: games.map((g) => g.name).join(", "),
    datesText: `${formatDate(startDate)} – ${formatDate(endDate)} (${rentalDays}${
      rentalDays === 1 ? " day" : " days"
    })`,
    rentalDays,
    amountText: peso(grandTotal),
    addressText: address.trim(),
  };
}
