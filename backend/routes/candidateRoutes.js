
const express = require("express");
const {
  getAllCandidates,
  getCandidateById,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  sendQuizEmail,
} = require("../Controller/candidateController");

const router = express.Router();

router.get("/", getAllCandidates);
router.get("/:id", getCandidateById);
router.post("/", addCandidate);
router.put("/:id", updateCandidate);
router.delete("/:id", deleteCandidate);

// Send quiz email
router.post("/send-test/:candidateId", sendQuizEmail);

module.exports = router;
