const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }, // index of the correct option
  },
  { _id: true }
); //so each question can be edited/deleted individually

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  questions: { type: [questionSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
