// routes/resultRoutes.js
const express = require("express");
const resultRoutes = express.Router();
const { getResults, createResult ,getResult} = require("../controllers/result.js");

// Routes
resultRoutes.get("/", getResults);      // GET all results (with optional query filter)
resultRoutes.post("/", createResult);   // POST new result
resultRoutes.get("/:resultId", getResult);

module.exports = resultRoutes;
