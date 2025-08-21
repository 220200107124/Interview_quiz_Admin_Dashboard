//
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Submission = require("../models/Submission");
const Result = require("../models/result");
const Quiz = require("../models/quizzes");
const Assignment = require("../models/Assignment");


// router.post("/", async (req, res) => {
//   console.log("=== SUBMIT QUIZ ROUTE START ===");
//   try {
//     console.log("request body",req.body);
//     const {
//       assignmentId,
//       candidateId: bodyCandidateId,
//       candidateName,
//       candidateEmail,
//       technology,
//       answers,
//     } = req.body;

//     console.log("REQ BODY:", JSON.stringify(req.body, null, 2));

//     if (!assignmentId || !answers) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     if (!Array.isArray(answers)) {
//       return res.status(400).json({ error: "Answers must be an array" });
//     }

//     // Fetch assignment + quiz
//     const assignment = await Assignment.findById(assignmentId).populate("quizId");
//     if (!assignment) {
//       return res.status(404).json({ error: "Assignment not found" });
//     }

//     if (assignment.status === "completed") {
//       return res.status(400).json({ error: "This assignment has already been completed" });
//     }

//     const quiz = assignment.quizId;
//     if (!quiz) {
//       return res.status(404).json({ error: "Quiz not found in assignment" });
//     }

//     console.log("Quiz found:", {
//       title: quiz.title,
//       questionsCount: quiz.questions?.length,
//     });

//     // --------- candidateId handling ----------
//     let candidateId = bodyCandidateId || assignment.candidateId;

//     if (!candidateId) {
//       return res.status(400).json({ error: "candidateId missing" });
//     }

//     // Ensure candidateId is a valid ObjectId
//     if (!mongoose.Types.ObjectId.isValid(candidateId)) {
//       return res.status(400).json({ error: "Invalid candidateId" });
//     }
//     candidateId = new mongoose.Types.ObjectId(candidateId);

//     // --------- Score calculation ----------
//     let correctAnswers = 0;
//     const totalQuestions = quiz.questions?.length || 0;

//     const formattedAnswers = answers.map((answer, index) => {
//       const question = quiz.questions[index];
//       if (question) {
//         const userAnswer = String(answer);
//         const correctAnswer = String(question.correctAnswer);
//         if (userAnswer === correctAnswer) {
//           correctAnswers++;
//         }
//         return { questionIndex: index, selectedOption: userAnswer };
//       }
//       return { questionIndex: index, selectedOption: String(answer) };
//     });

//     const percentage =
//       totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

//     console.log(
//       `Score: ${correctAnswers}/${totalQuestions} = ${percentage.toFixed(1)}%`
//     );

//     // --------- Save Submission ----------
//     const submission = new Submission({
//       assignment: assignment._id,
//       candidate: candidateId,
//       answers: formattedAnswers,
//       submittedAt: new Date(),
//       technology,
//     });
//     await submission.save();
//     console.log("Submission saved:", submission._id);

//     // --------- Save Result ----------
//     const result = new Result({
//       candidateName,
//       candidateEmail,
//       quizTitle: quiz.title,
//       technology: quiz.technology || "NOT Defined",
//       score: correctAnswers,
//       totalQuestions,
//       percentage,
//       attempts: 1,
//       status: "submitted",
//       date: new Date(),
//     });
//     await result.save();
//     console.log("Result saved:", result._id);

//     // --------- Update assignment ----------
//     assignment.status = "completed";
//     assignment.completedAt = new Date();
//     if (!assignment.startedAt) {
//       assignment.startedAt = new Date();
//     }
//     await assignment.save();
//     console.log("Assignment updated to completed");

//     return res.status(200).json({
//       message: "Quiz submitted successfully!",
//       score: `${correctAnswers}/${totalQuestions} (${percentage.toFixed(1)}%)`,
//       submissionId: submission._id,
//       resultId: result._id,
//       assignmentId: assignment._id,
//       candidateId: candidateId,
//     });
//   } catch (err) {
//     console.error("Submit quiz error:", err);
//     return res.status(500).json({
//       error: "Server error",
//       details: process.env.NODE_ENV === "development" ? err.message : undefined,
//     });
//   }
// });



//   console.log("=== SUBMIT QUIZ ROUTE START ===");
//   try {
//     const { assignmentId, candidateId, candidateName, candidateEmail, answers } = req.body;

//     console.log("Request body:", req.body);

//     // Validate required fields
//     if (!assignmentId || !candidateId || !answers) {
//       console.log("Missing required fields");
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Validate answers is an array
//     if (!Array.isArray(answers)) {
//       return res.status(400).json({ error: "Answers must be an array" });
//     }

//     console.log("Basic validation passed");
//     console.log("Looking for assignment:", assignmentId);

//     // Find the assignment and populate quiz details
//     const assignment = await Assignment.findById(assignmentId).populate('quizId');

//     if (!assignment) {
//       console.log("Assignment not found");

//       // Debug: Show all assignments for this candidate
//       const candidateAssignments = await Assignment.find({ candidateId });
//       console.log("All assignments for candidate:", candidateAssignments.map(a => ({
//         _id: a._id,
//         candidateId: a.candidateId,
//         quizId: a.quizId,
//         status: a.status,
//         token: a.token
//       })));

//       return res.status(404).json({
//         error: "Assignment not found",
//         debugInfo: {
//           searchedAssignmentId: assignmentId,
//           candidateAssignments: candidateAssignments.map(a => a._id)
//         }
//       });
//     }

//     console.log("Assignment found:", assignment);

//     // Verify the candidateId matches the assignment
//     if (assignment.candidateId.toString() !== candidateId.toString()) {
//       return res.status(403).json({ error: "Candidate ID does not match assignment" });
//     }

//     // Check if assignment is already completed
//     if (assignment.status === 'completed') {
//       return res.status(400).json({ error: "This assignment has already been completed" });
//     }

//     // Get quiz from assignment
//     const quiz = assignment.quizId;
//     if (!quiz) {
//       return res.status(404).json({ error: "Quiz not found in assignment" });
//     }

//     console.log("Quiz found:", { title: quiz.title, questionsCount: quiz.questions?.length });

//     // Calculate score
//     let correctAnswers = 0;
//     const totalQuestions = quiz.questions?.length || 0;

//     if (totalQuestions > 0) {
//       answers.forEach((answer, index) => {
//         if (quiz.questions[index]) {
//           const question = quiz.questions[index];
//           // Handle both string and number answers
//           const userAnswer = typeof answer === 'string' ? answer : String(answer);
//           const correctAnswer = String(question.correctAnswer);

//           if (userAnswer === correctAnswer) {
//             correctAnswers++;
//           }
//         }
//       });
//     }

//     const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

//     console.log(`Score calculated: ${correctAnswers}/${totalQuestions} = ${score.toFixed(1)}%`);

//     // Create submission record
//     const submission = new Submission({
//       assignmentId: assignment._id,
//       candidateId,
//       candidateName: candidateName || 'Unknown',
//       candidateEmail: candidateEmail || 'No email provided',
//       quizId: quiz._id,
//       answers,
//       score,
//       submittedAt: new Date()
//     });

//     await submission.save();
//     console.log("Submission saved:", submission._id);

//     // Update assignment status
//     assignment.status = 'completed';
//     assignment.completedAt = new Date();
//     if (!assignment.startedAt) {
//       assignment.startedAt = new Date();
//     }
//     await assignment.save();

//     console.log("Assignment status updated to completed");

//     return res.status(200).json({
//       message: "Quiz submitted successfully!",
//       score: `${correctAnswers}/${totalQuestions} (${score.toFixed(1)}%)`,
//       submissionId: submission._id,
//       assignmentId: assignment._id
//     });

//   } catch (err) {
//     console.error("Submit quiz error:", err);
//     return res.status(500).json({
//       error: "Server error",
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// });

// GET /api/submit-quiz/result/:resultId - Get submission result

router.post('/', async (req, res) => {
  console.log("=== SUBMIT QUIZ ROUTE START ===");
  try {
     
    const { assignmentId, candidateName, candidateEmail, answers } = req.body;
   // from DB

    console.log("Request body:", req.body);

    if (!assignmentId  || !answers) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers must be an array" });
    }

    console.log("Basic validation passed");
    console.log("Looking for assignment with ID:", assignmentId);

    const assignment = await Assignment.findOne({ _id: assignmentId }).populate('quizId');
    const candidateId = assignment.candidateId;
      if (!candidateId) {
      console.log("Missing candidateId");
      return res.status(400).json({ error: "Missing candidateId" });
    }
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    if (assignment.status === 'completed') {
      return res.status(400).json({ error: "This assignment has already been completed" });
    }  



       if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
  return res.status(400).json({ error: "Invalid assignmentId" });
}
if (!mongoose.Types.ObjectId.isValid(candidateId)) {
  return res.status(400).json({ error: "Invalid candidateId" });
}


    const quiz = assignment.quizId;
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found in assignment" });
    }

    console.log("Quiz found:", { title: quiz.title, questionsCount: quiz.questions?.length });

    let correctAnswers = 0;
    const totalQuestions = quiz.questions?.length || 0;

    // Format answers for Submission schema
    const formattedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      if (question) {
        const userAnswer = String(answer);
        const correctAnswer = String(question.correctAnswer);
        if (userAnswer === correctAnswer) {
          correctAnswers++;
        }
        return {
          questionIndex: index,
          selectedOption: userAnswer
        };
      }
      return { questionIndex: index, selectedOption: String(answer) };
    });

    const percentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    console.log(`Score calculated: ${correctAnswers}/${totalQuestions} = ${percentage.toFixed(1)}%`);

    // Save Submission
    const submission = new Submission({
      assignment: assignment._id, // matches schema
      candidate: candidateId._id, // matches schema
      answers: formattedAnswers,
      submittedAt: new Date()
    });

    await submission.save();
    console.log("Submission saved:", submission._id);

    // Save Result
    const result = new Result({
      candidateName,
      candidateId,
      candidateEmail,
      quizTitle: quiz.title,
      technology: quiz.technology || "N/A",
      score: correctAnswers,
      totalQuestions: totalQuestions,
      percentage: percentage,
      attempts: 1,
      status: "submitted",
      date: new Date()
    });

    await result.save();
    console.log("Result saved:", result._id);

    // Update assignment status
    assignment.status = 'completed';
    assignment.completedAt = new Date();
    if (!assignment.startedAt) {
      assignment.startedAt = new Date();
    }
    await assignment.save();

    console.log("Assignment status updated to completed");

    return res.status(200).json({
      message: "Quiz submitted successfully!",
      score: `${correctAnswers}/${totalQuestions} (${percentage.toFixed(1)}%)`,
      submissionId: submission._id,
      resultId: result._id,
      assignmentId: assignment._id
    });

  } catch (err) {
    console.error("Submit quiz error:", err);
    return res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.get("/result/:resultId", async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId);
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.json(result);
  } catch (err) {
    console.error("Get result error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
