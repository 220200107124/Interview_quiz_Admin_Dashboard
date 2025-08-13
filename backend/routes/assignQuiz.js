// const express = require('express');
// const router = express.Router();
 // for generating token

// // POST /api/assign/:candidateId



// router.post('/assign/:candidateId', async (req, res) => {
//   const { candidateId } = req.params;
//   const { quizId } = req.body;

//   if (!quizId) {
//     return res.status(204).json({ message: 'quizId is required' });
//   }

//   try {
//     const candidate = await Candidate.findById(candidateId);
//     if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

//     // Prevent duplicate assignment
//     candidate.assignedQuizzes = candidate.assignedQuizzes || [];
//     if (candidate.assignedQuizzes.includes(quiz._id)) {
//       return res.status(304).json({ message: 'Quiz already assigned to this candidate' });
//     }

//     // Assign the quiz to candidate
//     candidate.assignedQuizzes.push(quiz._id);
//     await candidate.save();

//     // Create Assignment document with a token
//     const token = crypto.randomBytes(16).toString('hex'); // unique token
//     const assignment = new Assignment({
//       candidateId: candidate._id,
//       quizId: quiz._id,
//       token
//     });
//     await assignment.save();

//     res.json({ message: `Quiz "${quiz.title}" assigned to ${candidate.name} successfully!`, token });

//   } catch (err) {
//     console.error('Server error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });
// router.patch('/:candidateId/:quizId', async (req, res) => {
//   try {
//     const { candidateId, quizId } = req.params;

//     const assignment = await Assignment.findOne({ candidateId, quizId });

//     if (!assignment) {
//       return res.status(404).json({ error: 'Assignment not found' });
//     }

//     // Generate and update token
//     function generateTokenWithExpiry(size=16,expiresInMinutes=45){
//      const token =crypto.randomBytes(size).toString('hex');
//      const expiresAt=Date.now()+expiresInMinutes*60*1000;
//      return{token,expiresAt};
//     }
    
//     assignment.token = token;
//     assignment.status = 'pending'; // optional: reset status
//     assignment.assignedAt = new Date(); // optional: track when reassigned
//     await assignment.save();

//     res.status(200).json({
//       message: 'Token updated successfully',
//       token,
//       reassigned: true
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;
// routes/assignmentRoutes.js

// const express = require("express");

// const router = express.Router();
// const Candidate = require('../models/candidate');
// const Quiz = require('../models/quizzes');
// const Assignment = require('../models/Assignment');
// const crypto = require('crypto');

// // GET latest assigned quiz for a candidate
// router.get("/candidate/:candidateId", async (req, res) => {
//   try {
//     const { candidateId } = req.params;

//     // Fetch the latest assignment for the candidate based on createdAt
//     const latestAssignment = await Assignment.findOne({ candidateId })
//       .sort({ createdAt: -1 }) // Newest first
//       .populate("quizId") // Populate quiz details
//       .exec();

//     if (!latestAssignment) {
//       return res.status(404).json({ message: "No quiz assigned to this candidate." });
//     }

//     res.status(200).json(latestAssignment);
//   } catch (error) {
//     console.error("Error fetching candidate assignment:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
// routes/assign.js
const express = require("express");
const router = express.Router();

const Candidate = require("../models/candidate");
const Quiz = require("../models/quizzes");
const Assignment = require("../models/Assignment");

// POST /api/assign/:candidateId
// Assign a quiz to a candidate. If the same (candidateId, quizId) exists, update assignedAt & status instead of creating duplicate.
router.post("/assign/:candidateId", async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { quizId } = req.body;

    if (!quizId) return res.status(400).json({ message: "quizId is required" });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // If an assignment already exists for this candidate+quiz, update assignedAt & reset status -> pending
    let assignment = await Assignment.findOne({ candidateId, quizId });
    if (assignment) {
      assignment.assignedAt = new Date();
      assignment.status = "pending";
      await assignment.save();
      return res.json({ message: "Quiz reassigned (existing assignment updated)", assignment });
    }

    // otherwise create new assignment
    assignment = new Assignment({
      candidateId,
      quizId,
      status: "pending",
      assignedAt: new Date(),
    });
    await assignment.save();

    // Optionally keep track in candidate.assignedQuizzes array (if you use that)
    candidate.assignedQuizzes = candidate.assignedQuizzes || [];
    if (!candidate.assignedQuizzes.some((id) => id.toString() === quizId.toString())) {
      candidate.assignedQuizzes.push(quiz._id);
      await candidate.save();
    }

    return res.status(201).json({ message: "Quiz assigned to candidate", assignment });
  } catch (err) {
    console.error("Assign error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/assign/:candidateId/:quizId
// Force reassign (same as POST existing case) — updates assignedAt and resets status
router.patch("/:candidateId/:quizId", async (req, res) => {
  try {
    const { candidateId, quizId } = req.params;

    const assignment = await Assignment.findOne({ candidateId, quizId });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    assignment.assignedAt = new Date();
    assignment.status = "pending";
    await assignment.save();

    return res.json({ message: "Assignment updated (reassigned)", assignment });
  } catch (err) {
    console.error("Reassign error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/assignments/candidate/:candidateId
// Return only the latest assignment for the candidate (by assignedAt)
router.get("/assignments/candidate/:candidateId", async (req, res) => {
  try {
    const { candidateId } = req.params;
    const latest = await Assignment.findOne({ candidateId })
      .sort({ assignedAt: -1 })
      .populate("quizId")
      .exec();

    if (!latest) return res.status(404).json({ message: "No quiz assigned to this candidate." });

    return res.json(latest);
  } catch (err) {
    console.error("Fetch latest assignment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/assignment/:assignmentId
// Return assignment details (populated quiz) — used by candidate page to fetch quiz by assignment id
router.get("/assignment/:assignmentId", async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId).populate("quizId").exec();
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    return res.json(assignment);
  } catch (err) {
    console.error("Get assignment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
