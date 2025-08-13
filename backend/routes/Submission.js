// routes/submitQuiz.js
// const express = require("express");
// const router = express.Router();
// const Submission = require("../models/Submission");
// const Result = require("../models/result");
// const Quiz = require("../models/quizzes");
// // controllers/submissionController.js


// const startQuiz = async (req, res) => {
//   try {
//     const { assignmentId, candidateId } = req.body;

//     // Check if already started
//     let existing = await Submission.findOne({
//       assignment: assignmentId,
//       candidate: candidateId,
//       status: "pending",
//     });

//     if (existing) {
//       return res.status(200).json(existing);
//     }

//     // Create new pending submission
//     const submission = await Submission.create({
//       assignment: assignmentId,
//       candidate: candidateId,
//       status: "pending"
//     });

//     res.status(201).json(submission);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to start quiz" });
//   }
// };

// router.post("/", async (req, res) => {
//   try {
//     const {
//       assignmentId,
//       candidateId,
//       candidateName,
//       candidateEmail,
//       answers,
//     } = req.body;

//     // ✅ Validate required fields
//     if (
//       !assignmentId ||
//       !candidateId ||
//       !candidateName ||
//       !candidateEmail ||
//       !answers
//     ) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     //  Save raw submission
//     const submission = new Submission({
//       assignment: assignmentId,
//       candidate: candidateId,
//       answers: answers.map((ans, idx) => ({
//         questionIndex: idx,
//         selectedOption: ans,
//       })),
//     });
//     await submission.save();

//     // 2Load quiz to compare correct answers
//     const quiz = await Quiz.findById(assignmentId);
//     if (!quiz) {
//       return res.status(404).json({ error: "Quiz not found" });
//     }
//     else if(quiz.status!==active){
//       return res.status(400).json({
//         error:"quiz not active"
//       })
//     }

//     const totalQuestions = quiz.questions.length;

//     // 3️ Calculate score
//     let score = 0;
//     quiz.questions.forEach((q, i) => {
//       if (
//         answers[i] !== null &&
//         answers[i] !== undefined &&
//         answers[i] !== "" &&
//         answers[i] === q.correctAnswer
//       ) {
//         score++;
//       }
//     });
//     const percentage = totalQuestions ? (score / totalQuestions) * 100 : 0;

//     // 4️Check if this candidate has already taken this quiz
//     let resultDoc = await Result.findOne({
//       candidateEmail,
//       quizTitle: quiz.title,
//     });

//     if (resultDoc) {
//       //  Same quiz & candidate → increment attempts
//       resultDoc.attempts = (resultDoc.attempts || 1) + 1;
//       resultDoc.score = score;
//       resultDoc.totalQuestions = totalQuestions;
//       resultDoc.percentage = percentage;
//       resultDoc.status = "submitted";
//       resultDoc.date = Date.now();
//       await resultDoc.save();
//     } else {
//       //  First time for this quiz
//       resultDoc = new Result({
//         candidateName,
//         candidateEmail,
//         quizTitle: quiz.title,
//         technology: quiz.category || quiz.technology,
//         score,
//         totalQuestions,
//         percentage,
//         attempts: 1,
//         status: "submitted",
//         date: Date.now(),
//       });
//       await resultDoc.save();
//     }

//     return res.json({
//       message: "Quiz submitted and scored successfully",
//       result: resultDoc,
//     });

//   } catch (err) {
//     console.error("Submit quiz error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;
// routes/submitQuiz.js
// const express = require("express");
// const router = express.Router();

// const Submission = require("../models/Submission");
// const Result = require("../models/result");
// const Quiz = require("../models/quizzes");
// const Assignment = require("../models/Assignment"); //  Added missing import

// // -------------------- START QUIZ --------------------
// const startQuiz = async (req, res) => {
//   try {
//     const { assignmentId, candidateId } = req.body;

//     // Check if already started but not submitted
//     let existing = await Submission.findOne({
//       assignment: assignmentId,
//       candidate: candidateId,
//       status: "pending",
//     });

//     if (existing) {
//       return res.status(200).json(existing);
//     }

//     // Create new pending submission
//     const submission = await Submission.create({
//       assignment: assignmentId,
//       candidate: candidateId,
//       status: "pending",
//     });

//     res.status(201).json(submission);
//   } catch (error) {
//     console.error("Start quiz error:", error);
//     res.status(500).json({ error: "Failed to start quiz" });
//   }
// };

// // router.post("/start", startQuiz); //  Now connected to route

// // -------------------- SUBMIT QUIZ --------------------
// router.post("/", async (req, res) => {
//   try {
//     const {
//       assignmentId,
//       candidateId,
//       candidateName,
//       candidateEmail,
//       answers,
//       token,
      
//     } = req.body;

//     //  Validate required fields
//     if (
//       !assignmentId ||
//       !candidateId ||
//       !candidateName ||
//       !candidateEmail ||
//       !answers
//     ) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // 1️ Find the assignment
//     const assignment = await Assignment.findById(assignmentId);
//     if (!assignment) {
//       return res.status(404).json({ error: "Assignment not found" });
//     }

//     // 2️ Validate token
//     if (assignment.token !== token) {
//       return res.status(401).json({ error: "Invalid token" });
//     }
//     if (assignment.tokenExpiresAt && assignment.tokenExpiresAt < Date.now()) {
//       return res.status(401).json({ error: "Token expired" });
//     }

//     // 3️ Prevent duplicate submissions (same assignment + candidate)
//     const alreadySubmitted = await Submission.findOne({
//       assignment: assignmentId,
//       candidate: candidateId,
//       status: "submitted",
//     });
//     if (alreadySubmitted) {
//       return res.status(400).json({ error: "Quiz already submitted" });
//     }

//     // 4️ Load the quiz
//     const quiz = await Quiz.findById(assignment.quizId);
//     if (!quiz) {
//       return res.status(404).json({ error: "Quiz not found" });
//     }
//     if (quiz.status !== "active") {
//       return res.status(400).json({ error: "Quiz not active" });
//     }

//     const totalQuestions = quiz.questions.length;

//     // 5️ Save raw submission
//     const submission = new Submission({
//       assignment: assignmentId,
//       candidate: candidateId,
//       answers: answers.map((ans, idx) => ({
//         questionIndex: idx,
//         selectedOption: ans,
//       })),
//       status: "submitted",
//     });
//     await submission.save();

//     // 6️ Calculate score
//     let score = 0;
//     quiz.questions.forEach((q, i) => {
//       if (
//         answers[i] !== null &&
//         answers[i] !== undefined &&
//         answers[i] !== "" &&
//         answers[i] === q.correctAnswer
//       ) {
//         score++;
//       }
//     });
//     const percentage = totalQuestions
//       ? Math.round((score / totalQuestions) * 100)
//       : 0;

//     // 7️ Save/update result
//     let resultDoc = await Result.findOne({
//       candidateEmail,
//       quizTitle: quiz.title,
//     });

//     if (resultDoc) {
//       resultDoc.attempts = (resultDoc.attempts || 0) + 1;
//       resultDoc.score = score;
//       resultDoc.totalQuestions = totalQuestions;
//       resultDoc.percentage = percentage;
//       resultDoc.status = "submitted";
//       resultDoc.date = Date.now();
//       await resultDoc.save();
//     } else {
//       resultDoc = new Result({
//         candidateName,
//         candidateEmail,
//         quizTitle: quiz.title,
//         technology: quiz.category || quiz.technology,
//         score,
//         totalQuestions,
//         percentage,
//         attempts: 1,
//         status: "submitted",
//         date: Date.now(),
//       });
//       await resultDoc.save();
//     }

//     // 8️ Send response
//     return res.json({
//       message: "Quiz submitted and scored successfully",
//       result: resultDoc,
//     });
//   } catch (err) {
//     console.error("Submit quiz error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;


// routes/submitQuiz.js
const express = require("express");
const router = express.Router();

const Submission = require("../models/Submission");
const Result = require("../models/result");
const Quiz = require("../models/quizzes");
const Assignment = require("../models/Assignment");

// POST /api/submit-quiz
// body: { assignmentId, candidateId, candidateName, candidateEmail, answers: ["Option1", "Option2", ...] }
router.post("/", async (req, res) => {
  try {
    const { assignmentId, candidateId, candidateName, candidateEmail, answers } = req.body;

    if (!assignmentId || !candidateId || !candidateName || !candidateEmail || !answers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // find assignment
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ error: "Assignment not found" });

    // optional: ensure the assignment belongs to candidateId
    if (assignment.candidateId.toString() !== candidateId.toString()) {
      return res.status(400).json({ error: "Assignment does not belong to candidate" });
    }

    // prevent duplicate submission (if you want strict one submission per assignment)
    const alreadySubmitted = await Submission.findOne({
      assignment: assignmentId,
      candidate: candidateId,
      status: "submitted",
    });
    if (alreadySubmitted) {
      return res.status(400).json({ error: "Quiz already submitted for this assignment" });
    }

    // find quiz by assignment.quizId
    const quiz = await Quiz.findById(assignment.quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    if (quiz.status !== "active") {
      return res.status(400).json({ error: "Quiz not active" });
    }

    const totalQuestions = quiz.questions.length;

    // Save raw submission
    const submission = new Submission({
      assignment: assignmentId,
      candidate: candidateId,
      answers: answers.map((ans, idx) => ({
        questionIndex: idx,
        selectedOption: ans,
      })),
      status: "submitted",
      submittedAt: Date.now(),
    });
    await submission.save();

    // Score
    let score = 0;
    for (let i = 0; i < totalQuestions; i++) {
      const q = quiz.questions[i];
      const selected = answers[i];

      // If correctAnswer stored as index, convert to option text for comparison.
      let correctValue;
      if (typeof q.correctAnswer === "number") {
        correctValue = String(q.options?.[q.correctAnswer]);
      } else {
        correctValue = String(q.correctAnswer);
      }

      if (selected !== null && selected !== undefined && String(selected) === correctValue) {
        score++;
      }
    }

    const percentage = totalQuestions ? Math.round((score / totalQuestions) * 100) : 0;

    // Save result (one document per attempt)
    const resultDoc = new Result({
      candidateName,
      candidateEmail,
      quizTitle: quiz.title,
      technology: quiz.category || quiz.technology,
      score,
      totalQuestions,
      percentage,
      attempts: 1,
      status: "submitted",
      date: Date.now(),
      assignment: assignmentId,
      candidateId,
      quizId: quiz._id,
    });
    await resultDoc.save();

    // Mark assignment completed
    assignment.status = "completed";
    await assignment.save();

    return res.json({
      message: "Quiz submitted and scored successfully",
      result: resultDoc,
    });
  } catch (err) {
    console.error("Submit quiz error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

