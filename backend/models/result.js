// const mongoose = require('mongoose');
// const resultSchema = new mongoose.Schema({
//   candidateName: { type: String, required: true },
//   candidateEmail: { type: String, required: true },
//   quizTitle: { type: String, required: true },
//   technology: { type: String, required: true },
//   score: { type: Number, required: true },
//   totalQuestions: { type: Number, required: true },
//   percentage: { type: Number, required: true },
//   date: { type: Date, default: Date.now }
// });
// module.exports = mongoose.model('result', resultSchema);
// models/Result.js
const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  candidateEmail: { type: String, required: true },
  quizTitle: { type: String, required: true },
  technology: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
