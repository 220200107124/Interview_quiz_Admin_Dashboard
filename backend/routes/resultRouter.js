const express = require('express');
const router = express.Router();
require('dotenv').config();

const Result = require('../models/result');

// GET /api/results - get all quiz results
router.get('/', async (req, res) => {
  try {
    const results = await Result.find().sort({ date: -1 }); // latest first
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Optionally: GET /api/results/:candidateName
router.get('/:candidateName', async (req, res) => {
  try {
    const { candidateName } = req.params;
    const candidateResults = await Result.find({ candidateName });
    res.json(candidateResults);
  } catch (err) {
    console.error('Error fetching candidate results:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
