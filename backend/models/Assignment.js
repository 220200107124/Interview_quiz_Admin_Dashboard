const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "quizzes", required: true },
  token: { type: String, required: true  },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
