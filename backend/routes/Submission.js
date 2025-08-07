// routes/submitQuiz.js
const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Result = require('../models/result');
const Quiz = require('../models/quizzes');

router.post('/', async (req, res) => {
  try {
    const { assignmentId, candidateId, candidateName, candidateEmail, answers } = req.body;

    // Validate required fields
    if (!assignmentId || !candidateId || !candidateName || !candidateEmail || !answers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1️⃣ Save raw submission
    const submission = new Submission({
      assignment: assignmentId,
      candidate: candidateId,
      answers: answers.map((ans, idx) => ({
        questionIndex: idx,
        selectedOption: ans
      }))
    });
    await submission.save();

    // 2️⃣ Load quiz to compare correct answers
    const quiz = await Quiz.findById(assignmentId);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const totalQuestions = quiz.questions.length;

    // 3️⃣ Calculate attempts and score
    const attemptCount = answers.filter(ans => ans !== null && ans !== undefined && ans !== '').length;
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] !== null && answers[i] !== undefined && answers[i] !== '' &&
          answers[i] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = totalQuestions ? (score / totalQuestions) * 100 : 0;

    // 4️⃣ Save final result
    const resultDoc = await Result.create({
      candidateName,
      candidateEmail,
      quizTitle: quiz.title,
      technology: quiz.category || quiz.technology,
      score,
      totalQuestions,
      percentage,
      date: Date.now()
    });

    return res.json({
      message: 'Quiz submitted and scored successfully',
      result: resultDoc,
      attempts: attemptCount
    });
  } catch (err) {
    console.error('Submit quiz error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
