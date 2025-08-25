
const express = require("express");
const {
  getAllCandidates,
  getCandidateById,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  sendQuizEmail,
} = require("../controllers/candidate.js");

const candidateRoute = express.Router();

candidateRoute.get("/", getAllCandidates);
candidateRoute.get("/:id", getCandidateById);
candidateRoute.post("/", addCandidate);
candidateRoute.put("/:id", updateCandidate);
candidateRoute.delete("/:id", deleteCandidate);

// Send quiz email
candidateRoute.post("/send-test/:candidateId", sendQuizEmail);

module.exports = candidateRoute;
