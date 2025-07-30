// models/Quiz.js
const mongoose = require('mongoose');

// Define question subdocument schema
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],  // array of strings, required
  correctAnswer: { type: Number, required: true } // index of correct option
}, { _id: false }); // don't need separate _id for each question

// Define main quiz schema
const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Beginner', 'Intermediate', 'Advanced'], required: true },
  questions: { type: [questionSchema], required: true },
  createdAt: { type: Date, default: Date.now }
});

// Export the model
module.exports = mongoose.model('Quiz', quizSchema);
