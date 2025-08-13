// const mongoose = require("mongoose");

// const assignmentSchema = new mongoose.Schema({
//   candidateId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Candidate",
//     required: true,
//   },
//   quizId: { type: mongoose.Schema.Types.ObjectId, ref: "quizzes", required: true },
//   token: { type: String, required: true  },
// });

// module.exports = mongoose.model("Assignment", assignmentSchema);
// const mongoose = require("mongoose");

// const assignmentSchema = new mongoose.Schema({
//   candidateId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Candidate",
//     required: true,
//   },
//   quizId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "quizzes",
//     required: true
//   },
//   token: {
//     type: String,
//     required: true
//   },
//   tokenExpiresAt: {
//     type: Date, // expiry timestamp for the token
//   },
//   status: {
//     type: String,
//     enum: ["pending", "completed", "expired"],
//     default: "pending"
//   },
//   assignedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model("Assignment", assignmentSchema);
// const mongoose = require("mongoose");

// const assignmentSchema = new mongoose.Schema({
//   candidateId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Candidate",
//     required: true,
//   },
//   quizId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "quizzes",
//     required: true,
//   },
//   token: { type: String, required: true, unique: true },
// });

// module.exports = mongoose.model("Assignment", assignmentSchema);
// models/Assignment.js
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true,
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "quizzes",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  // optional token field kept for future use
  token: {
    type: String,
  },
});

module.exports = mongoose.model("Assignment", assignmentSchema);

