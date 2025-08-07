// const express = require('express');
// const router = express.Router();
// require('dotenv').config();

// const Quiz = require('../models/quizzes');

// // Get all quizzes from the mongoDb Database
// router.get('/', async (req, res) => {
//   try {
//     const quizzes = await Quiz.find().sort({ createdAt: -1 });
//     res.json(quizzes);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create the quiz
// router.post('/', async (req, res) => {
//   try {
//     const quiz = new Quiz(req.body);
//     await quiz.save();
//     res.json(quiz);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Update the  quiz 
// router.put('/:id', async (req, res) => {
//   try {
//     const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updatedQuiz);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Delete a quiz
// router.delete('/:id', async (req, res) => {
//   try {
//     await Quiz.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Quiz deleted' });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
// router.get('/:id', async (req, res) => {
//   try {
//     const quiz = await Quiz.findById(req.params.id);
//     res.json(quiz);
//   } catch (err) {
//     res.status(404).json({ error: 'Quiz not found' });
//   }
// });


// module.exports = router;



const express = require('express');
const router = express.Router();
const Quiz = require('../models/quizzes');

// 1️⃣ Create a quiz
router.post('/', async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 2️⃣ Get all quizzes
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3️⃣ Get single quiz
router.get('/:candidateId', async (req, res) => {
  const candidate = await Candidate.findById(req.params.candidateId).populate('quizzes.quiz');
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

  // Return quizzes array with quiz details and token
  res.json(candidate.quizzes);
});

// 4️⃣ Update quiz info (title, category, difficulty, description)
router.put('/:id', async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5️⃣ Delete a quiz
router.delete('/:id', async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6️⃣ Add a question to a quiz
router.post('/:id/questions', async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    if (!question || !options || correctAnswer === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    quiz.questions.push({ question, options, correctAnswer });
    await quiz.save();

    res.json({ message: 'Question added', quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7️⃣ Edit a question
router.put('/:quizId/questions/:questionId', async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const { question, options, correctAnswer } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    const q = quiz.questions.id(questionId);
    if (!q) return res.status(404).json({ error: 'Question not found' });

    if (question) q.question = question;
    if (options) q.options = options;
    if (correctAnswer !== undefined) q.correctAnswer = correctAnswer;

    await quiz.save();
    res.json({ message: 'Question updated', quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8️⃣ Delete a question
router.delete('/:quizId/questions/:questionId', async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    quiz.questions.id(questionId).remove();
    await quiz.save();

    res.json({ message: 'Question deleted', quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
