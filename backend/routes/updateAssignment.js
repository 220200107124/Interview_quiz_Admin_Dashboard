// // 

// // routes/assign.js (CommonJS)
// const express = require('express');
// const crypto = require('crypto');
// const Assignment = require('../models/Assignment');
// const router = express.Router();

// router.patch('/:candidateId/:quizId', async (req, res) => {
//   console.log('PATCH /api/assign/:candidateId/:quizId called', req.params);
//   try {
//     const { candidateId, quizId } = req.params;
//     const assignment = await Assignment.findOne({ candidateId, quizId });
//     if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

//     const newToken = crypto.randomBytes(16).toString('hex');
//     assignment.token = newToken;
//     assignment.status = 'pending';
//     assignment.assignedAt = new Date();
//     await assignment.save();

//     console.log('PATCH succeeded for', candidateId, quizId);
//     res.status(200).json({ message: 'Quiz reassigned', token: newToken });
//   } catch (err) {
//     console.error('PATCH error', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// module.exports = router;
