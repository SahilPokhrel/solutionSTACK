const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");

// Create a new problem
router.post("/", async (req, res) => {
  try {
    const problem = new Problem({
      ...req.body,
      reactions: { fire: 0, check: 0 }, // Initialize reactions
      comments: [],
      solutions: [],
    });
    await problem.save();
    res.status(201).json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all problems (sorted by newest)
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a reaction (fire/check)
router.post("/:id/reaction", async (req, res) => {
  try {
    const { type } = req.body; // Expect "fire" or "check"
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    if (!problem.reactions) problem.reactions = { fire: 0, check: 0 };
    problem.reactions[type] += 1;

    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a comment
router.post("/:id/comment", async (req, res) => {
  const { username, text } = req.body;

  try {
    const problem = await Problem.findById(req.params.id);
    problem.comments.push({ username, text });
    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});


// Add a solution
router.post("/:id/answer", async (req, res) => {
  const { username, text } = req.body;

  try {
    const problem = await Problem.findById(req.params.id);
    problem.answers.push({ username, text });
    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: "Failed to add answer" });
  }
});


// Set difficulty level
router.patch("/:id/difficulty", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    problem.difficulty = req.body.difficulty;
    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:problemId/comment/:commentId", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.problemId);
    problem.comments = problem.comments.filter(
      (comment) => comment._id.toString() !== req.params.commentId
    );
    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

router.delete("/:problemId/answer/:answerId", async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.problemId);
    problem.answers = problem.answers.filter(
      (answer) => answer._id.toString() !== req.params.answerId
    );
    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete answer" });
  }
});

module.exports = router;
