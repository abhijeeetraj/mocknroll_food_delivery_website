import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["customer", "admin", "restaurant"],
      default: "customer"
    },
    address: { type: String, default: "" },
    phone: { type: String, default: "" }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
