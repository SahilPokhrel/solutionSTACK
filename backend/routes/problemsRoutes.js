import express from "express";
import Problem from "../models/problemModel.js"; // ✅ Now it works correctly


const router = express.Router();

// Get all problems
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 }); // Sort newest first
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: "Error fetching problems", error });
  }
});

// POST a new problem
router.post("/", async (req, res) => {
  try {
    console.log("🔹 Received data:", req.body); // ✅ Log incoming data

    const { title, description, difficulty, tags } = req.body;

    // ✅ Check if required fields are missing
    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: "All fields are required (title, description, difficulty)" });
    }

    const problem = new Problem({
      title,
      description,
      difficulty,
      tags: tags || [], // Default empty array
    });

    const savedProblem = await problem.save();
    console.log("✅ Problem saved:", savedProblem);

    res.status(201).json(savedProblem);
  } catch (error) {
    console.error("❌ Error saving problem:", error);
    res.status(500).json({ message: "Error posting problem", error });
  }
});


// Update problem (comments, solutions, reactions)
router.patch("/:id", async (req, res) => {
  try {
    const updatedProblem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProblem) return res.status(404).json({ message: "Problem not found" });
    res.json(updatedProblem);
  } catch (error) {
    res.status(500).json({ message: "Error updating problem", error });
  }
});

export default router;
