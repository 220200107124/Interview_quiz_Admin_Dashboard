const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      // Auto-generate token if not provided
      return require("crypto").randomBytes(16).toString("hex");
    },
  },
  status: {
    type: String,
    enum: ["pending", "submitted", "completed"],
    default: "pending",
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent duplicate assignments for same candidate+quiz
assignmentSchema.index({ candidateId: 1, quizId: 1 }, { unique: true });

// Ensure token is unique
assignmentSchema.index({ token: 1 }, { unique: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
