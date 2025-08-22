// module.exports = router;
const express = require("express");
const router = express.Router();

const Candidate = require("../models/candidate");
const Quiz = require("../models/quizzes");
const Assignment = require("../models/Assignment");
const sendMail = require("../email");



router.post("/assign/:candidateId", async (req, res) => {
  console.log("POST assign method begins");
  try {
    const { candidateId } = req.params;
    const { quizId, title } = req.body;

    // Validate required fields
    if (!quizId) {
      return res.status(400).json({ message: "quizId is required" });
    }

    // Validate candidateId format
    if (!candidateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid candidate ID format" });
    }

    // Validate quizId format
    if (!quizId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid quiz ID format" });
    }

    // Check candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Check quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Check assignment
    let assignment = await Assignment.findOne({ candidateId, quizId });

    if (assignment) {
      // Update existing assignment
      assignment.assignedAt = new Date();
      assignment.status = "pending";
      await assignment.save();

      console.log("Quiz reassigned to existing assignment");

      // Prepare quiz link
      const quizLink = `https://comfy-selkie-020033.netlify.app/quiz/${assignment.token}`;

      // Send mail
      await sendMail(
        candidate.email,
        "Quiz Reassigned - Your Quiz Link",
        `Hi ${candidate.name},\n\nYour quiz has been reassigned. Use this link to take it:\n${quizLink}\n\nGood luck!`,
        `<p>Hi <b>${candidate.name}</b>,</p>
         <p>Your quiz has been reassigned. Click below to take it:</p>
         <a href="${quizLink}">${quizLink}</a>
         <p><i>Good luck!</i></p>`
      );

      return res.status(200).json({
        message: "Quiz reassigned (existing assignment updated)",
        assignment,
        quizLink,
      });
    }

    // Create new assignment
    assignment = new Assignment({
      candidateId,
      quizId,
      status: "pending",
      assignedAt: new Date(),
    });

    await assignment.save();
    console.log("New assignment created:", assignment._id);

    // Update candidate's assignedQuizzes
    if (candidate.assignedQuizzes) {
      const quizExists = candidate.assignedQuizzes.some(
        (id) => id.toString() === quizId.toString()
      );

      if (!quizExists) {
        candidate.assignedQuizzes.push(quizId);
        await candidate.save();
      }
    }

    // Prepare quiz link
    const quizLink = `https://comfy-selkie-020033.netlify.app/quiz/${assignment.token}`;

    // Send mail
    await sendMail(
      candidate.email,
      "New Quiz Assigned - Your Quiz Link",
      `Hi ${candidate.name},\n\nYou have been assigned a new quiz. Use this link to take it:\n${quizLink}\n\nGood luck!`,
      `<p>Hi <b>${candidate.name}</b>,</p>
       <p>You have been assigned a new quiz. Click below to take it:</p>
       <a href="${quizLink}">${quizLink}</a>
       <p><i>Good luck!</i></p>`
    );

    console.log("POST assign method completed successfully");

    return res.status(201).json({
      message: "Quiz assigned to candidate successfully",
      assignment,
      quizLink,
    });
  } catch (err) {
    console.error("Assign error:", err);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// router.post("/assign/:candidateId", async (req, res) => {
//   console.log("POST assign method begins");
//   try {
//     const { candidateId } = req.params;
//     const { quizId, title } = req.body; // Added title extraction

//     // Validate required fields
//     if (!quizId) {
//       return res.status(400).json({ message: "quizId is required" });
//     }

//     // Validate candidateId format (assuming MongoDB ObjectId)
//     if (!candidateId.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ message: "Invalid candidate ID format" });
//     }

//     // Validate quizId format
//     if (!quizId.match(/^[0-9a-fA-F]{24}$/)) {
//       return res.status(400).json({ message: "Invalid quiz ID format" });
//     }

//     // Check if candidate exists
//     const candidate = await Candidate.findById(candidateId);
//     if (!candidate) {
//       return res.status(404).json({ message: "Candidate not found" });
//     }

//     // Check if quiz exists
//     const quiz = await Quiz.findById(quizId);
//     if (!quiz) {
//       return res.status(404).json({ message: "Quiz not found" });
//     }

//     // Check if assignment already exists
//     let assignment = await Assignment.findOne({ candidateId, quizId });

//     if (assignment) {
//       // Update existing assignment
//       assignment.assignedAt = new Date();
//       assignment.status = "pending";
//       await assignment.save();

//       console.log("Quiz reassigned to existing assignment");
//       return res.status(200).json({
//         message: "Quiz reassigned (existing assignment updated)",
//         assignment
//       });
//     }

//     // Create new assignment
//     assignment = new Assignment({
//       candidateId,
//       quizId,
//       status: "pending",
//       assignedAt: new Date(),
//     });

//     await assignment.save();
//     console.log("New assignment created:", assignment._id);

//     // Update candidate's assignedQuizzes array (if you're using this field)
//     if (candidate.assignedQuizzes) {
//       const quizExists = candidate.assignedQuizzes.some(
//         (id) => id.toString() === quizId.toString()
//       );

//       if (!quizExists) {
//         candidate.assignedQuizzes.push(quizId);
//         await candidate.save();
//       }
//     }

//     console.log("POST assign method completed successfully");
//     return res.status(201).json({
//       message: "Quiz assigned to candidate successfully",
//       assignment
//     });

//   } catch (err) {
//     console.error("Assign error:", err);
//     return res.status(500).json({
//       message: "Server error",
//       error: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// });

// PATCH /api/assign/:candidateId/:quizId
// Force reassign (same as POST existing case) — updates assignedAt and resets status
router.patch("/:candidateId/:quizId", async (req, res) => {
  console.log("PATCH reassign method begins");
  try {
    const { candidateId, quizId } = req.params;

    // Validate ID formats
    if (
      !candidateId.match(/^[0-9a-fA-F]{24}$/) ||
      !quizId.match(/^[0-9a-fA-F]{24}$/)
    ) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const assignment = await Assignment.findOne({ candidateId, quizId });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    assignment.assignedAt = new Date();
    assignment.status = "pending";
    await assignment.save();

    console.log("Assignment updated successfully");
    return res.status(200).json({
      message: "Assignment updated (reassigned)",
      assignment,
    });
  } catch (err) {
    console.error("Reassign error:", err);
    return res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// GET /api/assign/assignments/candidate/:candidateId
// Return only the latest assignment for the candidate (by assignedAt)
router.get("/assignments/candidate/:candidateId", async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid candidate ID format" });
    }

    const latest = await Assignment.findOne({ candidateId })
      .sort({ assignedAt: -1 })
      .populate("quizId")
      .exec();

    if (!latest) {
      return res
        .status(404)
        .json({ message: "No quiz assigned to this candidate." });
    }

    return res.status(200).json(latest);
  } catch (err) {
    console.error("Fetch latest assignment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/assign/assignment/:assignmentId
// Return assignment details (populated quiz) — used by candidate page to fetch quiz by assignment id
router.get("/assignment/:assignmentId", async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!assignmentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid assignment ID format" });
    }

    const assignment = await Assignment.findById(assignmentId)
      .populate("quizId")
      .exec();

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    return res.status(200).json(assignment);
  } catch (err) {
    console.error("Get assignment error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
