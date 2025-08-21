const mongoose = require("mongoose");
const Assignment = require("./Assignment");

const resultSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  quizTitle: { type: String, required: true },
  tech: { type: String, required: true },

  // Quiz performance
  score: { type: Number, required: true, default: 0 },
  
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },

  // Attempt tracking
  attempts: { type: Number, default: 1 },

  // // New status field
  // status: { type: String, enum: ["pending", "submitted"], default: "pending" },
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
