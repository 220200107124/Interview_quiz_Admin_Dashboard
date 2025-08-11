require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const candidateRoutes = require("./routes/candidateRoutes");
const AdminCreateQuizs = require("./routes/quizzesRoutes");
const assignQuizRouter = require("./routes/assignQuiz");
const resultRoutes = require("./routes/resultRouter");
const quizByCandidateRouter = require("./routes/quizByCandidate");
const submitQuizRouter = require("./routes/Submission");
const States=require("./routes/State")
const updateAssignmentRouter=require("./routes/updateAssignment")

// modules

const Candidate = require("./models/quizzes"); 
const Quiz = require("./models/candidate"); 
const Result = require("./models/result");
const Submission = require("./models/Submission");




const app = express();
app.use(cors());
app.use(express.json());




// mongodb connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));
// app.get("/", async (req, res) => {
//   try {
//     const candidates = await Candidate.find().limit(5); // just showing top 5
//     const quizzes = await Quiz.find().limit(5);
//     const results = await Result.find().limit(5);

//     res.send(`
//       <h2> Backend Server is Running! </h2>
//       <p>Available API Routes:</p>
//       <ul>
//         <li><code>GET /api/candidates</code></li>
//         <li><code>GET /api/quizzes</code></li>
//         <li><code>GET /api/assign</code></li>
//         <li><code>GET /api/results</code></li>
//       </ul>
//       <hr />
//       <h3> Sample Candidates:</h3>
//       <pre>${JSON.stringify(candidates, null, 2)}</pre>

//       <h3> Sample Quizzes:</h3>
//       <pre>${JSON.stringify(quizzes, null, 2)}</pre>

//       <h3> Sample Results:</h3>
//       <pre>${JSON.stringify(results, null, 2)}</pre>
//     `);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching data from MongoDB");
//   }
// });



//api routes

app.use("/api/candidates", candidateRoutes);
app.use("/api/quizzes", AdminCreateQuizs);
app.use("/api/assign", assignQuizRouter);
app.use("/api/result", resultRoutes);
app.use("/api/quiz-by-candidate", quizByCandidateRouter);
app.use("/api/submit-quiz", submitQuizRouter);
app.use("/api/state",States);
app.use("api/assignment",updateAssignmentRouter)




// connection
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
