const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const Quiz = require('../models/quizzes');
const Assignment = require('../models/Assignment');
const crypto = require('crypto'); // for generating token

// POST /api/assign/:candidateId



router.post('/assign/:candidateId', async (req, res) => {
  const { candidateId } = req.params;
  const { quizId } = req.body;

  if (!quizId) {
    return res.status(400).json({ message: 'quizId is required' });
  }

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Prevent duplicate assignment
    candidate.assignedQuizzes = candidate.assignedQuizzes || [];
    if (candidate.assignedQuizzes.includes(quiz._id)) {
      return res.status(400).json({ message: 'Quiz already assigned to this candidate' });
    }

    // Assign the quiz to candidate
    candidate.assignedQuizzes.push(quiz._id);
    await candidate.save();

    // Create Assignment document with a token
    const token = crypto.randomBytes(16).toString('hex'); // unique token
    const assignment = new Assignment({
      candidateId: candidate._id,
      quizId: quiz._id,
      token
    });
    await assignment.save();

    res.json({ message: `Quiz "${quiz.title}" assigned to ${candidate.name} successfully!`, token });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.patch('/:candidateId/:quizId', async (req, res) => {
  try {
    const { candidateId, quizId } = req.params;

    const assignment = await Assignment.findOne({ candidateId, quizId });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Generate and update token
    const token = crypto.randomBytes(16).toString('hex');
    assignment.token = token;
    assignment.status = 'pending'; // optional: reset status
    assignment.assignedAt = new Date(); // optional: track when reassigned
    await assignment.save();

    res.status(200).json({
      message: 'Token updated successfully',
      token,
      reassigned: true
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;