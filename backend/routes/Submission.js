// routes/submitQuiz.js
const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");
const Result = require("../models/result");
const Quiz = require("../models/quizzes");
// controllers/submissionController.js


const startQuiz = async (req, res) => {
  try {
    const { assignmentId, candidateId } = req.body;

    // Check if already started
    let existing = await Submission.findOne({
      assignment: assignmentId,
      candidate: candidateId,
      status: "pending"
    });

    if (existing) {
      return res.status(200).json(existing);
    }

    // Create new pending submission
    const submission = await Submission.create({
      assignment: assignmentId,
      candidate: candidateId,
      status: "pending"
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ error: "Failed to start quiz" });
  }
};

router.post("/", async (req, res) => {
  try {
    const {
      assignmentId,
      candidateId,
      candidateName,
      candidateEmail,
      answers,
    } = req.body;

    // ✅ Validate required fields
    if (
      !assignmentId ||
      !candidateId ||
      !candidateName ||
      !candidateEmail ||
      !answers
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //  Save raw submission
    const submission = new Submission({
      assignment: assignmentId,
      candidate: candidateId,
      answers: answers.map((ans, idx) => ({
        questionIndex: idx,
        selectedOption: ans,
      })),
    });
    await submission.save();

    // 2Load quiz to compare correct answers
    const quiz = await Quiz.findById(assignmentId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    else if(quiz.status!==active){
      return res.status(400).json({
        error:"quiz not active"
      })
    }

    const totalQuestions = quiz.questions.length;

    // 3️ Calculate score
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (
        answers[i] !== null &&
        answers[i] !== undefined &&
        answers[i] !== "" &&
        answers[i] === q.correctAnswer
      ) {
        score++;
      }
    });
    const percentage = totalQuestions ? (score / totalQuestions) * 100 : 0;

    // 4️Check if this candidate has already taken this quiz
    let resultDoc = await Result.findOne({
      candidateEmail,
      quizTitle: quiz.title,
    });

    if (resultDoc) {
      //  Same quiz & candidate → increment attempts
      resultDoc.attempts = (resultDoc.attempts || 1) + 1;
      resultDoc.score = score;
      resultDoc.totalQuestions = totalQuestions;
      resultDoc.percentage = percentage;
      resultDoc.status = "submitted";
      resultDoc.date = Date.now();
      await resultDoc.save();
    } else {
      //  First time for this quiz
      resultDoc = new Result({
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
      });
      await resultDoc.save();
    }

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
