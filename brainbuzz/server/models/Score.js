const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    quizTitle: { type: String, required: true },
    category: { type: String, required: true },
    score: { type: Number, required: true },
    correct: { type: Number, required: true },
    wrong: { type: Number, required: true },
    percentage: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Score", scoreSchema);
