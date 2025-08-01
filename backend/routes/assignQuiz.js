const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const Quiz = require('../models/quizzes');
const nodemailer = require('nodemailer');

// POST /api/assign/:candidateId
router.post('/:candidateId', async (req, res) => {
  try {
    const { quizId } = req.body;
    const candidateId = req.params.candidateId;

    // Find candidate by ID
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    //  Optionally: check if quizId exists in quizzes collection
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Assign quiz to candidate
    // candidate.quizId =' 68870e30c4889e4b7270ac71';
    // await candidate.save();

    // Create transporter (Mailtrap)
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
        user: 'reenatanchak@gmail.com',
        pass: 'anar rnaa rouw uwxn'
      }
    });

    // Prepare email content
    const quizLink = `http://localhost:3000/quiz/${quizId}`;

    // Send email
    await transporter.sendMail({
      from: '"Quiz Platform" <reenatanchak@gmail.com>',
      to: candidate.email,
      subject: 'Your quiz is ready!',
      text: `Hi ${candidate.name},

Your quiz is ready! Click the link to start: ${quizLink}

Good luck!`
    });

    //  Success response
    res.json({ message: 'Quiz assigned and email sent successfully' });
  } catch (err) {
    console.log('Error in assigning quiz and sending email:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
