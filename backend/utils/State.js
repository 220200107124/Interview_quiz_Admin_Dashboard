
const express = require("express");
const router = express.Router();
const Quiz = require("../module/quiz/entity/quizzes"); 
const candidate = require("../module/candidate/entity/candidate");



router.get("/", async (req, res) => {
  try {
    const totalQuizzes = await Quiz.countDocuments();
    const totalCandidates = await candidate.countDocuments();

    // Active quizzes based on startDate and endDate
    const now = new Date();
    const activeQuizzes = await Quiz.countDocuments({
      startDate: { $lte: now },
      endDate: { $gte: now }
    });

    res.json({
      totalQuizzes,
      totalCandidates,
      activeQuizzes
    });

    console.log("Stats response sent ");
 
  } catch (err) {
    console.error("Error fetching stats data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

