const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const Score = require("../models/Score");
const User = require("../models/User");

// POST /api/scores  — save a quiz result
router.post("/", protect, async (req, res) => {
  const { quizTitle, category, score, correct, wrong, percentage } = req.body;
  try {
    await Score.create({
      user: req.user._id,
      userName: req.user.name,
      quizTitle,
      category,
      score,
      correct,
      wrong,
      percentage,
    });

    // Update user totals
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $inc: { totalScore: score, quizzesDone: 1 },
      },
      { new: true }
    );

    res.status(201).json({
      message: "Score saved",
      totalScore: updatedUser.totalScore,
      quizzesDone: updatedUser.quizzesDone,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/scores/leaderboard  — top 10 users by totalScore
router.get("/leaderboard", protect, async (req, res) => {
  try {
    const top = await User.find({})
      .sort({ totalScore: -1 })
      .limit(10)
      .select("name totalScore quizzesDone");
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/scores/me  — current user's quiz history
router.get("/me", protect, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
