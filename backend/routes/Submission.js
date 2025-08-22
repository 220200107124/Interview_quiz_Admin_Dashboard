//
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Submission = require("../models/Submission");
const Result = require("../models/result");
const Assignment = require("../models/Assignment");

router.post("/", async (req, res) => {
  console.log("=== SUBMIT QUIZ ROUTE START ===");
  try {
    const { assignmentId,  answers } = req.body;

    if (!assignmentId || !answers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers must be an array" });
    }

    console.log("Basic validation passed");
    console.log("Looking for assignment with ID:", assignmentId);

    const assignment = await Assignment.findOne({ _id: assignmentId }).populate(
      "quizId"
    )
    .populate("candidateId");
    const candidateId = assignment.candidateId;

    console.log("candidateId",candidateId)
    if (!candidateId) {
      console.log("Missing candidateId");
      return res.status(400).json({ error: "Missing candidateId" });
    }
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    if (assignment.status === "completed") {
      return res
        .status(400)
        .json({ error: "This assignment has already been completed" });
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

    console.log("Quiz found:", {
      title: quiz.title,
      questionsCount: quiz.questions?.length,
    });

    let correctAnswers = 0;
    const totalQuestions = quiz.questions?.length || 0;

    // const formattedAnswers = answers.map((answer, index) => {
    //   const question = quiz.questions[index];
    //   if (question) {
    //     const selectedOption = Number(answer.selectedOption ?? answer);
    //     console.log("answer", answer.selectedOption);

    //     if (question.correctAnswer === selectedOption) {
    //       correctAnswers++;
    //     }

    //     return {
    //       questionIndex: index,
    //       selectedOption, // <-- stored as number in DB
    //     };
    //   }
    //   return {
    //     questionIndex: index,
    //     selectedOption: Number(answer.selectedOption ?? answer),
    //   };
    // });

const formattedAnswers = answers.map((answer) => {
  const question = quiz.questions[answer.questionIndex];
  if (!question) return answer;

  const selectedOption = Number(answer.selectedOption);
  
  if (question.correctAnswer === selectedOption) {
    correctAnswers++;
  }

  return {
    questionIndex: answer.questionIndex,
    selectedOption,  // stores index (0,1,2..)
  };
});


    const percentage =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Save Submission
    const submission = new Submission({
      assignment: assignment._id, // matches schema
      candidate: candidateId._id, // matches schema
      answers: formattedAnswers,
      submittedAt: new Date(),
    });

    await submission.save();
    console.log("Submission saved:", submission._id);

    // Save Result
    const result = new Result({
      candidateId,
      quizTitle: quiz.title,
      tech: candidateId.tech || "N/A",
      score: correctAnswers,
      totalQuestions: totalQuestions,
      percentage: percentage,
      attempts: 1,
      status: "submitted",
      date: new Date(),
    });
    console.log("Results from DB:", result);

    await result.save();
    // Update assignment status
    assignment.status = "completed";
    submission.status = "completed";
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
      assignmentId: assignment._id,
    });
  } catch (err) {
    console.error("Submit quiz error:", err);
    return res.status(500).json({
      error: "Server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
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
