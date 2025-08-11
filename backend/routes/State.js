const express = require("express");
const router = express.Router();
const Quiz = require("../models/quizzes"); // adjust path if needed
const Candidate = require("../models/candidate"); // adjust path if needed

router.get("/", async (req, res) => {
  try {
    const totalQuizzes = await Quiz.countDocuments();
    const totalCandidates = await Candidate.countDocuments();

    res.json({
      totalQuizzes,
      totalCandidates
    });
    // console.log(totalQuizzes)
  } catch (err) {
    console.error("Error fetching stats data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
