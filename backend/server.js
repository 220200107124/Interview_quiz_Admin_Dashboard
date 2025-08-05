require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const candidateRoutes = require('./routes/candidateRoutes');
const AdminCreateQuizs = require('./routes/quizzesRoutes');
const assignQuizRouter = require('./routes/assignQuiz');
const resultRoutes = require('./routes/resultRouter');
const Candidate = require('./models/quizzes'); // Adjust path
const Quiz = require('./models/candidate'); // Adjust path
const Result = require('./models/result'); // Adjust path

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
app.get('/', async (req, res) => {
  try {
    const candidates = await Candidate.find().limit(5); // just showing top 5
    const quizzes = await Quiz.find().limit(5);
    const results = await Result.find().limit(5);

    res.send(`
      <h2> Backend Server is Running! </h2>
      <p>Available API Routes:</p>
      <ul>
        <li><code>GET /api/candidates</code></li>
        <li><code>GET /api/quizzes</code></li>
        <li><code>GET /api/assign</code></li>
        <li><code>GET /api/results</code></li>
      </ul>
      <hr />
      <h3> Sample Candidates:</h3>
      <pre>${JSON.stringify(candidates, null, 2)}</pre>

      <h3> Sample Quizzes:</h3>
      <pre>${JSON.stringify(quizzes, null, 2)}</pre>

      <h3> Sample Results:</h3>
      <pre>${JSON.stringify(results, null, 2)}</pre>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data from MongoDB');
  }
});


// app.use(/api/candidateQuizRoutes,candidateRoutes);


app.use('/api/candidates', candidateRoutes);
app.use('/api/quizzes', AdminCreateQuizs);
app.use('/api/assign', assignQuizRouter);
app.use('/api/results', resultRoutes);
// app.use('/api/candidate', candidateQuizRoutes);

const PORT = process.env.PORT|| 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
