

// module.exports = router;
const express = require("express");
const router = express.Router();
const { assignQuiz, reassignQuiz, getByToken } = require("../Controller/assignmentController");

router.post("/assign/:candidateId", assignQuiz);
router.patch("/:candidateId/:quizId", reassignQuiz);
router.get("/getByToken/:token", getByToken);

module.exports = router;
