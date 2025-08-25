const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  quizTitle: { type: String, required: true },
  tech: { type: String, required: true },
  score: { type: Number, required: true, default: 0 },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  attempts: { type: Number, default: 1 },
   status: {
  type: String,
  enum: ["pending", "submitted", "completed"], 
  default: "pending"
}
,

  // Timestamps
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Result", resultSchema);
