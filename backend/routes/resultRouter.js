
// // module.exports = router;
// const express = require("express");
// const router = express.Router();
// const Result = require("../models/result"); 

// // ✅ GET all results OR filter by technology
// router.get("/", async (req, res) => {
//   try {
//     const { technology } = req.query;

//     let query = {};
//     if (technology) {
//       // Case-insensitive match
//       query.technology = { $regex: new RegExp(`^${technology}$`, "i") };
//     }

//     const results = await Result.find(query)
//       .select(
//         "candidateName candidateEmail quizTitle technology score totalQuestions percentage status date"
//       )
//       .sort({ date: -1 });

//     if (!results || results.length === 0) {
//       return res.status(404).json({ message: "No results found" });
//     }

//     res.json(results);
//   } catch (err) {
//     console.error("Error fetching results:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Result = require("../models/result"); 

// ✅ GET all results OR filter by technology
router.get("/", async (req, res) => {
  try {
    const { technology } = req.query;
    console.log(req)

    let query = {};
    if (technology) {
      // Case-insensitive match
      query.technology = { $regex: new RegExp(`^${technology}$`, "i") };
    }

    const results = await Result.find(query)
      .select(
        "candidateName candidateEmail quizTitle technology score totalQuestions percentage status date"
      )
      .sort({ date: -1 });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No results found" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

//  GET results for a specific candidate by candidateId


router.get("/candidate/:candidateId", async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Ensure candidateId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(candidateId)) {
      return res.status(400).json({ message: "Invalid candidateId format" });
    }

    const results = await Result.find({ candidateId: new mongoose.Types.ObjectId(candidateId) })
      .select(
        "candidateName candidateEmail quizTitle technology score totalQuestions percentage status date"
      )
      .sort({ date: -1 });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No results found for this candidate" });
    }

    res.json(results);
  } catch (err) {
    console.error("Error fetching candidate results:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


module.exports = router;
