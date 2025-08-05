require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const candidateRoutes = require('./routes/candidateRoutes');
const AdminCreateQuizs = require('./routes/quizzesRoutes');
const assignQuizRouter = require('./routes/assignQuiz');
const resultRoutes = require('./routes/resultRouter');
// const candidateQuizRoutes = require('./routes/candidatequiz');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {

  useNewUrlParser: true,
  useUnifiedTopology: true


  // optional options like useNewUrlParser, useUnifiedTopology
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));
app.get('/', (req, res) => {
  res.send('✨ Backend server is running! ✨');
});
// app.use(/api/candidateQuizRoutes,candidateRoutes);


app.use('/api/candidates', candidateRoutes);
app.use('/api/quizzes', AdminCreateQuizs);
app.use('/api/assign', assignQuizRouter);
app.use('/api/results', resultRoutes);
// app.use('/api/candidate', candidateQuizRoutes);

const PORT = process.env.PORT|| 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
