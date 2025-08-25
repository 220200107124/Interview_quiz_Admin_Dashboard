const Quiz = require("../entity/quizzes");
// const Candidate = require("../../../candidate.js");

// Create quiz
const  createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all quizzes
const  getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get quizzes of a candidate
const  getCandidateQuizzes = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidateId).populate(
      "quizzes.quiz"
    );
    if (!candidate)
      return res.status(404).json({ error: "Candidate not found" });

    res.json(candidate.quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update quiz
const  updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedQuiz);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete quiz
const  deleteQuiz = async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: "Quiz deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add question
const  addQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer } = req.body;
    if (!question || !options || correctAnswer === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    quiz.questions.push({ question, options, correctAnswer });
    await quiz.save();

    res.json({ message: "Question added", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit question
const  editQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const { question, options, correctAnswer } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const q = quiz.questions.id(questionId);
    if (!q) return res.status(404).json({ error: "Question not found" });

    if (question) q.question = question;
    if (options) q.options = options;
    if (correctAnswer !== undefined) q.correctAnswer = correctAnswer;

    await quiz.save();
    res.json({ message: "Question updated", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete question
const  deleteQuestion = async (req, res) => {
  try {
    const { quizId, questionId } = req.params;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    quiz.questions.id(questionId).remove();
    await quiz.save();

    res.json({ message: "Question deleted", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports={createQuiz,getAllQuizzes,getCandidateQuizzes,updateQuiz,deleteQuiz,addQuestion,editQuestion
,deleteQuestion,
}