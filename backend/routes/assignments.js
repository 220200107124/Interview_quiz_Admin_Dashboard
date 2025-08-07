const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Candidate = require('../models/candidate');
const Quiz = require('../models/quizzes');

// Assign quiz to candidate
router.post('/assign', async (req, res) => {
  try {
    const { candidateId, quizId, expiryDate } = req.body;
    
    const candidate = await Candidate.findById(candidateId);
    const quiz = await Quiz.findById(quizId);
    
    if (!candidate || !quiz) return res.status(404).json({ error: 'Candidate or Quiz not found' });
    
    const assignment = new Assignment({ candidate: candidateId, quiz: quizId, expiryDate });
    await assignment.save();
    
    candidate.assignedQuizzes.push(assignment._id);
    await candidate.save();
    
    res.json({ message: 'Quiz assigned', link: `https://yourapp.com/test/${assignment.linkToken}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Candidate takes quiz via token
router.get('/:token', async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ linkToken: req.params.token })
      .populate('quiz');
    
    if (!assignment) return res.status(404).json({ error: 'Invalid token' });
    if (assignment.submitted) return res.status(400).json({ error: 'Quiz already submitted' });
    
    res.json({ quiz: assignment.quiz, assignmentId: assignment._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit quiz
router.post('/:token/submit', async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ linkToken: req.params.token });
    if (!assignment) return res.status(404).json({ error: 'Invalid token' });
    if (assignment.submitted) return res.status(400).json({ error: 'Quiz already submitted' });
    
    const { answers } = req.body; // [{ questionIndex, selectedOption }]
    
    const Submission = require('../models/Submission');
    const submission = new Submission({ assignment: assignment._id, answers });
    await submission.save();
    
    assignment.submitted = true;
    await assignment.save();
    
    res.json({ message: 'Quiz submitted successfully', submissionId: submission._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
