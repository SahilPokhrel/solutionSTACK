const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  difficulty: String,
  reactions: { fire: Number, check: Number },
  comments: [
    {
      username: String,
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  answers: [
    {
      username: String,
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

module.exports = mongoose.model("Problem", problemSchema);
