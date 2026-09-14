import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },

  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String },

  players: { type: String, required: true },
  playTime: { type: String, required: true },

  pricePerDay: { type: Number, required: true },
  deposit: { type: Number, required: true },
  lateFeePerDay: { type: Number, required: true },

  active: { type: Boolean, default: true },
});

export default mongoose.models.Game || mongoose.model("Game", GameSchema);
