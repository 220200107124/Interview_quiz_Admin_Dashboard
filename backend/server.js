const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const candidateRoutes = require('./routes/candidateRoutes');
const AdminCreateQuizs = require('./routes/quizzesRoutes');

const assignQuizRouter=require('./routes/assignQuiz')

const app = express();
app.use(cors());
app.use(express.json());




mongoose.connect('mongodb://127.0.0.1:27017/quizdb', {
  
}).then(() => console.log(' MongoDB connected'))
  .catch(err => console.error(' MongoDB error:', err));
  
  

app.use('/api/candidates', candidateRoutes);
app.use('/api/quizzes', AdminCreateQuizs);
app.use('/api/assign', assignQuizRouter);


app.listen(8080, () => console.log('Server started on port 8080 '));
