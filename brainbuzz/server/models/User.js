const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    totalScore: { type: Number, default: 0 },
    quizzesDone: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
