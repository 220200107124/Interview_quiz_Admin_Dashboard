// const Assignment = require('../models/Assignment');
const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const Quiz = require('../models/quizzes');
const crypto = require('crypto'); // Make sure this is imported!
const Assignment = require('../models/Assignment');
const candidate = require('../models/candidate');

// POST /api/assign/assign/:candidateId
router.post('/assign/:candidateId', async (req, res) => {
  console.log('POST assign method begins');
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  
  try {
    const { candidateId } = req.params;
    const { quizId, title } = req.body; // Extract title from request body

    // Validate required fields
    if (!quizId) {
      console.log(' No quizId provided');
      return res.status(400).json({ message: 'quizId is required' });
    }

    console.log('Looking for candidate:', candidateId);
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      console.log(' Candidate not found');
      return res.status(404).json({ message: 'Candidate not found' });
    }
    console.log('Candidate found:', candidate.name);

    console.log('Looking for quiz:', quizId);
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      console.log(' Quiz not found');
      return res.status(404).json({ message: 'Quiz not found' });
    }
    console.log('Quiz found:', quiz.title);

    // Check for existing assignment
    console.log('Checking for existing assignment...');
    let assignment = await Assignment.findOne({ candidateId, quizId });
    
    if (assignment) {
      console.log('Existing assignment found, updating...');
      
      // Generate new token for reassignment
      const newToken = crypto.randomBytes(16).toString('hex');
      assignment.token = newToken;
      assignment.status = 'pending';
      assignment.assignedAt = new Date();
      
      await assignment.save();
      console.log('Assignment updated successfully');
      
      return res.status(200).json({
        message: 'Quiz reassigned (existing assignment updated)',
        assignment,
        token: newToken
      });
    }

    console.log('No existing assignment found, creating new one...');
    
    // Generate token for new assignment
    const token = crypto.randomBytes(16).toString('hex');
    console.log('Generated token:', token);

    // Create new assignment with all required fields
    assignment = new Assignment({
      candidateId: candidateId,
      quizId: quizId,
      token: token,              // This was missing!
      status: 'pending',
      assignedAt: new Date()
    });

    console.log('Assignment data before save:', {
      candidateId: assignment.candidateId,
      quizId: assignment.quizId,
      token: assignment.token,
      status: assignment.status
    });

    await assignment.save();
    console.log(' Assignment created successfully:', assignment._id);

    // Update candidate's assignedQuizzes array if it exists
    if (candidate.assignedQuizzes && Array.isArray(candidate.assignedQuizzes)) {
      const quizExists = candidate.assignedQuizzes.some(
        (id) => id.toString() === quizId.toString()
      );
      
      if (!quizExists) {
        candidate.assignedQuizzes.push(quizId);
        await candidate.save();
        console.log(' Updated candidate assignedQuizzes');
      }
    }

    console.log('POST assign method completed successfully');
    return res.status(201).json({
      message: 'Quiz assigned to candidate successfully',
      assignment,
      token
    });

  } catch (err) {
    console.error('Assign error:', err);
     
    // Handle specific validation errors
    if (err.name === 'ValidationError') {
      console.error('Validation Error Details:');
      Object.keys(err.errors).forEach(key => {
        console.error(`- ${key}: ${err.errors[key].message}`);
      });
      
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.keys(err.errors).map(key => ({
          field: key,
          message: err.errors[key].message
        }))
      });
    }
    
    if (err.code === 11000) {
      console.error('Duplicate key error');
      return res.status(409).json({ message: 'Assignment already exists' });
    }
    
    return res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// PATCH route for reassignment
router.patch('/:candidateId/:quizId', async (req, res) => {
  console.log('PATCH reassign method begins');
  console.log('Params:', req.params);
  
  try {
    const { candidateId, quizId } = req.params;

    const assignment = await Assignment.findOne({ candidateId, quizId });
    if (!assignment) {
      console.log(' Assignment not found for PATCH');
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Generate new token and update
    const newToken = crypto.randomBytes(16).toString('hex');
    assignment.token = newToken;
    assignment.status = 'pending';
    assignment.assignedAt = new Date();
    
    await assignment.save();
    console.log('Assignment updated via PATCH');

    return res.status(200).json({
      message: 'Assignment updated (reassigned)',
      assignment,
      token: newToken
    });

  } catch (err) {
    console.error('PATCH error:', err);
    return res.status(500).json({
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});





router.get("/getByToken/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const result = await Assignment.aggregate([
      // Match token
      { $match: { token } },

      // Lookup Candidate details
      {
        $lookup: {
          from: "candidates",              // collection name in MongoDB
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateData"
        }
      },
      { $unwind: "$candidateData" }, // convert array to object

      // Lookup Quiz details
      {
        $lookup: {
          from: "quizzes",                 // collection name in MongoDB
          localField: "quizId",
          foreignField: "_id",
          as: "quizData"
        }
      },
      { $unwind: "$quizData" },

      // Optional: project only certain fields
      {
        $project: {
          token: 1,
          status: 1,
          assignedAt: 1,
          startedAt: 1,
          completedAt: 1,
          "candidateData._id": 1,
          
          "candidateData.name": 1,
          "candidateData.email": 1,
          "candidateData.tech":1,
          "candidateData.difficulty":1,
          "quizData.title": 1,
          "quizData.questions": 1
        }
      }
    ]);


    if (!result.length) {
      return res.status(404).json({ success: false, message: "Invalid or expired token" });
    }

    res.json({ success: true, data: result[0] });

  } catch (error) {
    console.error("Error fetching assignment by token:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
