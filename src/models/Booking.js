import mongoose from "mongoose";

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "out-for-delivery",
  "rented",
  "return-pending",
  "returned",
  "completed",
  "cancelled",
];

const BookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, required: true, unique: true },

    customer: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      address: { type: String, required: true },
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true }],

    rentalSubtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    depositTotal: { type: Number, required: true },
    grandTotal: { type: Number, required: true },

    gcashReferenceNumber: { type: String, required: true },

    status: { type: String, enum: BOOKING_STATUSES, default: "pending" },

    damageFee: { type: Number, default: 0 },
    depositReturned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
