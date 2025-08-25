

// module.exports = router;
const express = require("express");
const assignmentRouter = express.Router();
const {  reassignQuiz, getByToken, getLatestAssignmentByCandidate, getAssignmentById } = require("../controllers/assignment.js");
assignmentRouter.patch("/:candidateId/:quizId", reassignQuiz);
assignmentRouter.get("/getByToken/:token", getByToken);
assignmentRouter.get("/:candidateId", getLatestAssignmentByCandidate);
assignmentRouter.get("/:assignmentId", getAssignmentById);
module.exports = assignmentRouter;
