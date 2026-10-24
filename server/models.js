import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 255 },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0 },
    category: { type: String, maxlength: 50 },
    description: { type: String, default: "", maxlength: 500 },
    date: { type: String, required: true }, // YYYY-MM-DD, same as before
    month: { type: String, maxlength: 20 },
  },
  { timestamps: true }
);
transactionSchema.index({ userId: 1, date: -1 });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
