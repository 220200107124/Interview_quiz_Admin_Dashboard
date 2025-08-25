const Assignment = require("../../candidate/entity/Assignment");
const crypto = require("crypto");

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

// GET /assignments/candidate/:candidateId
const getLatestAssignmentByCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    if (!candidateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid candidate ID format" });
    }

    const latest = await Assignment.findOne({ candidateId })
      .sort({ assignedAt: -1 })
      .populate("quizId")
      .exec();

    if (!latest) return res.status(404).json({ message: "No quiz assigned" });

    return res.status(200).json(latest);
  } catch (err) {
    console.error("Fetch latest assignment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
// GET /assignment/:assignmentId
const getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    if (!assignmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid assignment ID format" });
    }

    const assignment = await Assignment.findById(assignmentId)
      .populate("quizId")
      .exec();

    if (!assignment)
      return res.status(404).json({ message: "Assignment not found" });

    return res.status(200).json(assignment);
  } catch (err) {
    console.error("Get assignment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  reassignQuiz,
  getByToken,
  getLatestAssignmentByCandidate,
  getAssignmentById,
};
