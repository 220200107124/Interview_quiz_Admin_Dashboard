const Candidate = require("../models/candidate");
const Quiz = require("../models/quizzes");
const Assignment = require("../models/Assignment");
const crypto = require("crypto");

// Assign quiz
const assignQuiz = async (req, res) => {
  console.log("POST assign method begins");

  try {
    const { candidateId } = req.params;
    const { quizId, title } = req.body;

    if (!quizId) return res.status(400).json({ message: "quizId is required" });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // check existing assignment
    let assignment = await Assignment.findOne({ candidateId, quizId });

    if (assignment) {
      const newToken = crypto.randomBytes(16).toString("hex");
      assignment.token = newToken;
      assignment.status = "pending";
      assignment.assignedAt = new Date();
      await assignment.save();

      return res.status(200).json({
        message: "Quiz reassigned",
        assignment,
        token: newToken,
      });
    }

    // create new
    const token = crypto.randomBytes(16).toString("hex");
    assignment = new Assignment({
      candidateId,
      quizId,
      token,
      status: "pending",
      assignedAt: new Date(),
    });

    await assignment.save();

    // update candidate record if needed
    if (
      candidate.assignedQuizzes &&
      !candidate.assignedQuizzes.includes(quizId)
    ) {
      candidate.assignedQuizzes.push(quizId);
      await candidate.save();
    }

    return res.status(201).json({
      message: "Quiz assigned successfully",
      assignment,
      token,
    });
  } catch (err) {
    console.error("Assign error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// Reassign (PATCH)
const reassignQuiz = async (req, res) => {
  try {
    const { candidateId, quizId } = req.params;
    const assignment = await Assignment.findOne({ candidateId, quizId });
    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    const newToken = crypto.randomBytes(16).toString("hex");
    assignment.token = newToken;
    assignment.status = "pending";
    assignment.assignedAt = new Date();
    await assignment.save();

    return res.status(200).json({
      message: "Assignment updated (reassigned)",
      assignment,
      token: newToken,
    });
  } catch (err) {
    console.error("PATCH error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

// Get by Token
const getByToken = async (req, res) => {
  try {
    const { token } = req.params;

    const result = await Assignment.aggregate([
      { $match: { token } },
      {
        $lookup: {
          from: "candidates",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateData",
        },
      },
      { $unwind: "$candidateData" },
      {
        $lookup: {
          from: "quizzes",
          localField: "quizId",
          foreignField: "_id",
          as: "quizData",
        },
      },
      { $unwind: "$quizData" },
      {
        $project: {
          token: 1,
          status: 1,
          assignedAt: 1,
          "candidateData.name": 1,
          "candidateData.email": 1,
          "candidateData.tech": 1,
          "candidateData.difficulty": 1,
          "quizData.title": 1,
          "quizData.questions": 1,
        },
      },
    ]);

    if (!result.length) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired token" });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error("Error fetching assignment by token:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { assignQuiz, reassignQuiz, getByToken };
