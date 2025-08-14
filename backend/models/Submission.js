// const mongoose = require("mongoose");

// const submissionSchema = new mongoose.Schema({
//   assignment: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Assignment",
//     required: true,
//   },
//   answers: [
//     {
//       questionIndex: Number,
//       selectedOption: String,
//     },
//   ],
//   submittedAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Submission", submissionSchema);
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidate",
    required: true
  },
  answers: [
    {
      questionIndex: Number,
      selectedOption: String
    }
  ],
  status: {
    type: String,
    enum: ["submitted", "pending", "scored"],
    default: "submitted"
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Prevent duplicate submissions
submissionSchema.index({ assignment: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);

