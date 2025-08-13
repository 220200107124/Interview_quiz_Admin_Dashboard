const Assignment = require('../models/Assignment');
const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const Quiz = require('../models/quizzes');


router.post('/:candidateId', async (req, res) => {
  try {
    const { quizId } = req.body;
    const candidateId = req.params.candidateId;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Check for existing assignment
    const existing = await Assignment.findOne({ candidateId, quizId });
    if (existing) {
      return res.status(304).json({ error: 'Quiz already assigned to this candidate.' });
    }
    else{
      console.log("no exsting assignment found")
    }

    // Generate token and save assignment
    const token = crypto.randomBytes(16).toString('hex');
    const assignment = new Assignment({ candidateId, quizId, token });
    await assignment.save();

    // Send email logic...
    res.status(200).json({ message: 'Quiz assigned successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:candidateId/:quizId', async (req, res) => {
  console.log('PATCH /api/assign/:candidateId/:quizId called', req.params);
  try {
    const { candidateId, quizId } = req.params;
    const assignment = await Assignment.findOne({ candidateId, quizId });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    const newToken = crypto.randomBytes(16).toString('hex');
    assignment.token = newToken;
    assignment.status = 'pending';
    assignment.assignedAt = new Date();
    await assignment.save();

    console.log('PATCH succeeded for', candidateId, quizId);
    res.status(200).json({ message: 'Quiz reassigned', token: newToken });
  } catch (err) {
    console.error('PATCH error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
// const express = require("express");
// const Assignment = require("../models/Assignment");
// const Submission = require("../models/Submission");
// const candidates=require("../models/candidate");
// const Quiz = require("../models/quizzes"); // your quiz model
// const { v4: uuidv4 } = require("uuid");

// const router = express.Router();

// // Assign quiz to candidate
// router.post("/:token", async (req, res) => {
//   try {
//     const { candidateId, quizId } = req.body;
//     const token = uuidv4();

//     const assignment = await Assignment.create({
//       candidateId,
//       quizId,
//       token,
//     });

//     res.json({
//       message: "Quiz assigned successfully",
//       token: assignment.token,
//       link: `http://localhost:3000/quiz/${assignment.token}`,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Get quiz by token
// router.get("/quiz/:token", async (req, res) => {
//   try {
//     const { token } = req.params;

//     const assignment = await Assignment.findOne({ token }).populate("candidateId");
//     if (!assignment) {
//       return res.status(404).json({ error: "Invalid token" });
//     }

//     res.json(assignment.quizId); // send quiz details
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Submit quiz answers
// router.post("/submit/:token", async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { answers } = req.body;

//     const assignment = await Assignment.findOne({ token });
//     if (!assignment) {
//       return res.status(404).json({ error: "Invalid token" });
//     }

//     const submission = await Submission.create({
//       assignment: assignment._id,
//       answers,
//     });

//     res.json({ message: "Submission saved", submission });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
