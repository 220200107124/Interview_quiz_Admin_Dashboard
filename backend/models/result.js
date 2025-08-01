const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  quizTitle: { type: String, required: true },
  technology: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  date: { type: String, required: true }  // or Date type if you prefer
});

module.exports = mongoose.model('Result', resultSchema);
