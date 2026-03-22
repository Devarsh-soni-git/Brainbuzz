const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

const quizBank = {
  tech: {
    title: "JavaScript Fundamentals",
    category: "tech",
    difficulty: "Medium",
    questions: [
      { q: "What does typeof null return in JavaScript?", opts: ["null", "undefined", "object", "number"], ans: 2 },
      { q: "Which HTTP method is used to UPDATE a resource in REST APIs?", opts: ["GET", "POST", "PUT", "DELETE"], ans: 2 },
      { q: "What does MERN stand for?", opts: ["MongoDB Express React Node", "MySQL Express Redux Node", "MongoDB Ember React Node", "MySQL Elastic React Next"], ans: 0 },
      { q: "Which hook manages side effects in React?", opts: ["useState", "useEffect", "useRef", "useContext"], ans: 1 },
      { q: "What is the time complexity of binary search?", opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"], ans: 2 },
    ],
  },
  general: {
    title: "General Knowledge Blast",
    category: "general",
    difficulty: "Easy",
    questions: [
      { q: "What is the capital of Japan?", opts: ["Seoul", "Beijing", "Tokyo", "Bangkok"], ans: 2 },
      { q: "Which planet has the most moons?", opts: ["Jupiter", "Saturn", "Uranus", "Neptune"], ans: 1 },
      { q: "How many sides does a hexagon have?", opts: ["5", "6", "7", "8"], ans: 1 },
      { q: "Who painted the Mona Lisa?", opts: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"], ans: 2 },
      { q: "What is the fastest land animal?", opts: ["Lion", "Cheetah", "Horse", "Leopard"], ans: 1 },
    ],
  },
  science: {
    title: "Science Trivia",
    category: "science",
    difficulty: "Medium",
    questions: [
      { q: "What is the chemical symbol for Gold?", opts: ["Go", "Gd", "Au", "Ag"], ans: 2 },
      { q: "How many chromosomes does a human cell have?", opts: ["23", "44", "46", "48"], ans: 2 },
      { q: "What force keeps planets in orbit?", opts: ["Friction", "Gravity", "Magnetism", "Tension"], ans: 1 },
      { q: "What is the speed of light (approx)?", opts: ["200,000 km/s", "300,000 km/s", "400,000 km/s", "500,000 km/s"], ans: 1 },
      { q: "What is H₂O commonly known as?", opts: ["Hydrogen", "Oxygen", "Water", "Salt"], ans: 2 },
    ],
  },
  math: {
    title: "Math Challenge",
    category: "math",
    difficulty: "Medium",
    questions: [
      { q: "What is the square root of 144?", opts: ["11", "12", "13", "14"], ans: 1 },
      { q: "What is 15% of 200?", opts: ["25", "30", "35", "40"], ans: 1 },
      { q: "If 2x + 4 = 14, what is x?", opts: ["3", "4", "5", "6"], ans: 2 },
      { q: "What is the value of π (pi) approx?", opts: ["3.14", "3.15", "3.12", "3.16"], ans: 0 },
      { q: "What is the area of a circle with radius 5?", opts: ["25π", "10π", "15π", "20π"], ans: 0 },
    ],
  },
};

// GET /api/quiz  — returns all quizzes (without answers)
router.get("/", protect, (req, res) => {
  const safeQuizzes = Object.values(quizBank).map(({ title, category, difficulty, questions }) => ({
    title,
    category,
    difficulty,
    questionCount: questions.length,
  }));
  res.json(safeQuizzes);
});

// GET /api/quiz/:category  — returns full quiz WITH answers for active session
router.get("/:category", protect, (req, res) => {
  const quiz = quizBank[req.params.category];
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  res.json(quiz);
});

module.exports = router;
