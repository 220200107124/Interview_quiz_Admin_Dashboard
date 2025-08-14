const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const Quiz = require("../models/quizzes");
const Assignment = require("../models/Assignment"); // This should store assigned quizzes

// GET /api/quiz-by-candidate/:candidateId
router.get("/:candidateId", async (req, res) => {
  const { candidateId } = req.params;

  try {
    // Make sure candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate)
      return res.status(404).json({ error: "Candidate not found" });

    // Find assigned quizzes from the Assignment collection
    // Assuming Assignment schema: { candidateId, quizId, token }
    const assignments = await Assignment.find({ candidateId }).populate(
      "quizId"
    );

    // Map to desired structure for React
    const assignedQuizzes = assignments.map((a) => ({
      token: a.token,
      quiz: a.quizId, // populated quiz object { title, questions. }
    }));

    res.json(assignedQuizzes);
  } catch (err) {
    console.error("Error fetching quizzes by candidate:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
