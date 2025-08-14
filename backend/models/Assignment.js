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
//   status: {
//     type: String,
//     enum: ["pending", "completed"],
//     default: "pending",
//   },
//   assignedAt: {
//     type: Date,
//     default: Date.now,
//   },
//   // optional token field kept for future use
//   token: {
//     type: String,
//   },
// });

// module.exports = mongoose.model("Assignment", assignmentSchema);
// const mongoose = require("mongoose");

// const assignmentSchema = new mongoose.Schema({
  
//   questions: [
//     {
//       questionText: String,
//       options: [String],
//       correctAnswer: String
//     }
//   ],
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Assignment", assignmentSchema);
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      // Auto-generate token if not provided
      return require('crypto').randomBytes(16).toString('hex');
    }
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed", "expired"],
    default: "pending"
  },
  assignedAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Prevent duplicate assignments for same candidate+quiz
assignmentSchema.index({ candidateId: 1, quizId: 1 }, { unique: true });

// Ensure token is unique
assignmentSchema.index({ token: 1 }, { unique: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
