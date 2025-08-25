const express = require("express");
const authRoutes = require("../module/auth/routes/authRoute.js");
const candidateRoute = require("../module/candidate/routes/candidateRoute.js");
const quizRoute =require("../module/quiz/routes/quizzesRoutes.js");
const router = express.Router();
const States=require("../utils/State.js");
const resultRoutes=require("../module/result/routes/resultRouter.js");
 const assignRouter=require("../module/assign/routes/assignRoute.js")
 const submissionRouter =require("../module/submission/routes/submissionRoutes.js");
 const assignmentRouter=require("../module/assignment/routes/assignmentRoutes.js")
// Use them with prefixes
router.use("/auth", authRoutes);
router.use("/candidates",candidateRoute);
router.use("/quizzes",quizRoute);
router.use("/state",States);
router.use("/result",resultRoutes);
router.use("/assign",assignRouter);
router.use("/submit-quiz",submissionRouter);
router.use("/assignment",assignmentRouter);



module.exports = router;
