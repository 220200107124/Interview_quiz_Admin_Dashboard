const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Assignment = require('../models/Assignment');

// PATCH: Update token for an existing assignment
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
