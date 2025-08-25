// routes/assignmentRoutes.js
const express = require("express");
const assignmentRouter = express.Router();
const { assignQuiz, reassignQuiz } = require("../controllers/assign");

// Routes mapping
assignmentRouter.post("/:candidateId", assignQuiz);
assignmentRouter.patch("/:candidateId/:quizId", reassignQuiz);

module.exports = assignmentRouter;
