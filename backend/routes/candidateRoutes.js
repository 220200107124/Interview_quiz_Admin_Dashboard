const express = require("express");
const Candidate = require("../models/candidate");
const router = express.Router();

// GET all candidates
router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST add new candidate
router.post("/", async (req, res) => {
  try {
    const newCandidate = new Candidate(req.body);
    const saved = await newCandidate.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update candidate
router.put("/:id", async (req, res) => {
  try {
    const updated = await Candidate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE candidate
router.delete("/:id", async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ message: "Candidate deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    res.json(candidate);
  } catch (err) {
    res.status(404).json({ error: "Candidate not found" });
  }
});
router.post("/send-test/:candidateId", async (req, res) => {
  const candidate = await Candidate.findById(req.params.candidateId);
  if (!candidate)
    return res.status(404).json({ message: "Candidate not found" });

  const quizLink = `http://localhost:3000/quiz/${candidate._id}`;

  // Send email using nodemailer or any service
  // For example:
  const nodemailer = require("nodemailer");
  const transporter = nodemailer.createTransport({
    /* SMTP config */
  });

  await transporter.sendMail({
    from: "EMAIL_USER",
    to: candidate.email,
    subject: "Your quiz link",
    text: `Please take your quiz: ${quizLink}`,
  });

  res.json({ message: "Email sent successfully" });
});

module.exports = router;
