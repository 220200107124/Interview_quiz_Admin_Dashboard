const express = require("express");
const { login } = require("../controllers/auth.js");

const authRoutes = express.Router();

// Auth login route
authRoutes.post("/login", login);

module.exports = authRoutes;
