// const mongoose = require("mongoose");

// const submissionSchema = new mongoose.Schema({
//   assignment: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Assignment",
//     required: true,
//   },
//   candidate: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Candidate",
//     required: true,
//   },
//   answers: [
//       { questionIndex: Number, selectedOption: Number }

//   ],
  
//     status: {
//     type: String,
//     enum: ["pending", "submitted", "completed"], 
//     default: "pending"
//   },
//   submittedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });
// module.exports = mongoose.model("Submission", submissionSchema);
// backend/module/submission/models/Submission.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  answers: [
    {
      questionIndex: { type: Number, required: true },
      selectedOption: { type: Number, required: true }
    }
  ],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Submission", submissionSchema);
