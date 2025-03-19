import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: [String], default: [] },
    votes: { type: Number, default: 0 },
    answers: { type: [String], default: [] },
    difficulty: { type: String, required: true, enum: ["Easy", "Medium", "Hard"] },
    comments: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
