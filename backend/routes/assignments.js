const Assignment = require('../models/Assignment');

router.post('/:candidateId', async (req, res) => {
  try {
    const { quizId } = req.body;
    const candidateId = req.params.candidateId;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

    // Check for existing assignment
    const existing = await Assignment.findOne({ candidateId, quizId });
    if (existing) {
      return res.status(400).json({ error: 'Quiz already assigned to this candidate.' });
    }

    // Generate token and save assignment
    const token = crypto.randomBytes(16).toString('hex');
    const assignment = new Assignment({ candidateId, quizId, token });
    await assignment.save();

    // Send email logic...
    res.status(200).json({ message: 'Quiz assigned successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
