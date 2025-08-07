const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  lname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, //  unique emails
    lowercase: true,
    trim: true
  },
  tech: {
    type: String,
    required: true,
    trim: true
  },
  difficulty: {
    type: String,
    required: true,
    trim: true,
    enum: ['Easy','Beginner', 'Intermediate', 'Advanced'] // optional
  }
}, {
  timestamps: true
});

// Add a  index to make (tech + difficulty) unique:
candidateSchema.index({ tech: 1, difficulty: 1 }, { unique: true });

module.exports = mongoose.model('Candidate', candidateSchema);




