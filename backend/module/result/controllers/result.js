const Result = require("../entity/result");

// Get all results
const getResults = async (req, res) => {
  try {
    const { technology } = req.query;

    let query = {};
    if (technology) {
      query.tech = { $regex: new RegExp(`^${technology}$`, "i") }; // fixed key from technology -> tech
    }

    const results = await Result.find(query)
      .populate("candidateId") // include candidate details
      .sort({ date: -1 });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const createResult = async (req, res) => {
  try {
    const { candidateId, technology, quizTitle, score, totalQuestions, percentage } = req.body;

    if (!candidateId || !technology) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ✅ fetch candidate info from DB
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }

    const newResult = new Result({
      candidateId,
      candidateName: candidate.name,   // ensure never undefined
      candidateEmail: candidate.email,
      quizTitle,
      tech: technology,
      score,
      totalQuestions,
      percentage,
      attempts: 1,
      status: "submitted",
      date: new Date(),
    });

    const savedResult = await newResult.save();
    res.status(201).json(savedResult);
  } catch (error) {
    console.error("Error creating result:", error);
    res.status(500).json({ error: "Failed to create result" });
  }
};



// =================== GET RESULT ===================
const getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId);
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.json(result);
  } catch (err) {
    console.error("Get result error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getResults,
  createResult,
  getResult
};
