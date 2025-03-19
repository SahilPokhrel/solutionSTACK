const Problem = require("../models/problemModel");

exports.createProblem = async (req, res) => {
    try {
        const problem = new Problem(req.body);
        await problem.save();
        res.status(201).json(problem);
    } catch (error) {
        res.status(500).json({ message: "Error creating problem", error });
    }
};

exports.getProblems = async (req, res) => {
    try {
        const problems = await Problem.find();
        res.status(200).json(problems);
    } catch (error) {
        res.status(500).json({ message: "Error fetching problems", error });
    }
};