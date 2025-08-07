// const express = require('express');
// const router = express.Router();
// require('dotenv').config();

// const Candidate = require('../models/candidate');
// const Quiz = require('../models/quizzes');
// const nodemailer = require('nodemailer');

// // POST /api/assign/:candidateId
// router.post('/:candidateId', async (req, res) => {
//   try {
//     const { quizId } = req.body;
//     const candidateId = req.params.candidateId;

//     // Find candidate by ID
//     const candidate = await Candidate.findById(candidateId);
//     if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

//     //  Optionally: check if quizId exists in quizzes collection
//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

//     // Assign quiz to candidate
//     // candidate.quizId =' 68870e30c4889e4b7270ac71';
//     // await candidate.save();

//     // Create transporter (Mailtrap)
//     const transporter = nodemailer.createTransport({
//       service:'gmail',
//       auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS
// }

//     });

//     // Prepare email content
//    // Prepare email content with quiz title
// // SERVER_URL=https://interview-quiz-admin-dashboard.onrender.com
// const quizLink = `SERVER_URL/quiz/${quizId}`;
// const mailOptions = {
//   from: '"Quiz Platform" <reenatanchak@gmail.com>',
//   to: candidate.email,
//   subject: `Your quiz "${quiz.title}" is ready!`,
//   text: `Hi ${candidate.name},

// Your quiz titled "${quiz.title}" is ready! 

// Click the link below to start:
// ${quizLink}

// Good luck!`
// };

// // Send email
// await transporter.sendMail(mailOptions);


//    //Success response
// res.json({ message: `Quiz "${quiz.title}" assigned and email sent successfully` });

//   } catch (err) {
//     console.log('Error in assigning quiz and sending email:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });
// module.exports = router;
// routes/assign.js
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

module.exports = router;



