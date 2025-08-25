const express = require("express");
const submissionRouter = express.Router();
const { submitQuiz } = require("../controllers/Submission");

// Submit quiz
submissionRouter.post("/", submitQuiz);

module.exports = submissionRouter;
