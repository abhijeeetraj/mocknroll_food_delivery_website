import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    preference: {
      type: String,
      enum: ["vegetarian", "non_vegetarian", "eggetarian"],
      required: true
    },
    category: { type: String, default: "general" },
    tags: { type: [String], default: [] },
    imageUrl: { type: String, default: "" },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    prepTimeMinutes: { type: Number, default: 20, min: 1 },
    isPopular: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
