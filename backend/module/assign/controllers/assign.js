// controllers/assignmentController.js
const Candidate = require("../../candidate/entity/candidate");
const Quiz = require("../../quiz/entity/quizzes");
const Assignment = require("../../candidate/entity/Assignment");
const sendMail = require("../../candidate/controllers/email");

// POST /assign/:candidateId
const assignQuiz = async (req, res) => {
  console.log("POST assign method begins");
  try {
    const { candidateId } = req.params;
    const { quizId } = req.body;

    if (!quizId) return res.status(400).json({ message: "quizId is required" });
    if (!candidateId.match(/^[0-9a-fA-F]{24}$/))
      return res.status(400).json({ message: "Invalid candidate ID format" });
    if (!quizId.match(/^[0-9a-fA-F]{24}$/))
      return res.status(400).json({ message: "Invalid quiz ID format" });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let assignment = await Assignment.findOne({ candidateId, quizId });

    const quizLinkBase = "https://comfy-selkie-020033.netlify.app/quiz/";

    if (assignment) {
      assignment.assignedAt = new Date();
      assignment.status = "pending";
      await assignment.save();

      const quizLink = `${quizLinkBase}${assignment.token}`;

      await sendMail(
        candidate.email,
        "Quiz Reassigned - Your Quiz Link",
        `Hi ${candidate.name},\n\nYour quiz has been reassigned. Use this link:\n${quizLink}\n\nGood luck!`,
        `<p>Hi <b>${candidate.name}</b>,</p>
         <p>Your quiz has been reassigned. Click below:</p>
         <a href="${quizLink}">${quizLink}</a>`
      );

      return res.status(200).json({ message: "Quiz reassigned", assignment, quizLink });
    }

    // new assignment
    assignment = new Assignment({
      candidateId,
      quizId,
      status: "pending",
      assignedAt: new Date(),
    });
    await assignment.save();

    if (candidate.assignedQuizzes) {
      const quizExists = candidate.assignedQuizzes.some(id => id.toString() === quizId.toString());
      if (!quizExists) {
        candidate.assignedQuizzes.push(quizId);
        await candidate.save();
      }
    }

    const quizLink = `${quizLinkBase}${assignment.token}`;

    await sendMail(
      candidate.email,
      "New Quiz Assigned - Your Quiz Link",
      `Hi ${candidate.name},\n\nYou have been assigned a new quiz. Use this link:\n${quizLink}\n\nGood luck!`,
      `<p>Hi <b>${candidate.name}</b>,</p>
       <p>You have been assigned a new quiz. Click below:</p>
       <a href="${quizLink}">${quizLink}</a>`
    );

    return res.status(201).json({ message: "Quiz assigned", assignment, quizLink });
  } catch (err) {
    console.error("Assign error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// PATCH /:candidateId/:quizId
const reassignQuiz = async (req, res) => {
  console.log("PATCH reassign method begins");
  try {
    const { candidateId, quizId } = req.params;

    if (!candidateId.match(/^[0-9a-fA-F]{24}$/) || !quizId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const assignment = await Assignment.findOne({ candidateId, quizId });
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    assignment.assignedAt = new Date();
    assignment.status = "pending";
    await assignment.save();

    return res.status(200).json({ message: "Assignment updated", assignment });
  } catch (err) {
    console.error("Reassign error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};




module.exports = {
  assignQuiz,
  reassignQuiz,

};
