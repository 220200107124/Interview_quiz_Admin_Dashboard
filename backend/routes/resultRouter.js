const express = require("express");
const router = express.Router();
const Result = require("../models/result"); // Adjust path if needed

// GET all results
router.get("/", async (req, res) => {
  try {
    const results = await Result.find().sort({ date: -1 }); // latest first
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
