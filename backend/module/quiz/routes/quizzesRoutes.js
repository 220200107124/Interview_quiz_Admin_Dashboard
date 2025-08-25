
const express = require("express");
const {
  createQuiz,
  getAllQuizzes,
  getCandidateQuizzes,
  updateQuiz,
  deleteQuiz,
  addQuestion,
  editQuestion,
  deleteQuestion,
} = require("../controllers/quiz.js");

const quizRoute = express.Router();

quizRoute.post("/", createQuiz); // Create quiz
quizRoute.get("/", getAllQuizzes); // Get all quizzes
quizRoute.get("/:candidateId", getCandidateQuizzes); // Get quizzes of candidate
quizRoute.put("/:id", updateQuiz); // Update quiz
quizRoute.delete("/:id", deleteQuiz); // Delete quiz

// Question management
quizRoute.post("/:id/questions", addQuestion);
quizRoute.put("/:quizId/questions/:questionId", editQuestion);
quizRoute.delete("/:quizId/questions/:questionId", deleteQuestion);

module.exports =quizRoute;
