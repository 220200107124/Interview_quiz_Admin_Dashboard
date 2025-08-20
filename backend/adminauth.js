// adminAuth.js
require("dotenv").config(); // Load .env file
const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("./models/admin.js")
const app = express();
app.use(express.json());


// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// --- Admin login route ---
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Invalid email");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2. Compare password with hashed password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("Invalid password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful, token generated");
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// --- Middleware for admin authorization ---
function adminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") throw new Error("Invalid role");
    req.admin = decoded;
    console.log("Token verified for admin:", decoded.email);
    next();
  } catch (err) {
    console.log("Unauthorized access:", err.message);
    res.status(403).json({ message: "Unauthorized" });
  }
}

// --- Protected admin route ---
app.get("/admin", adminAuth, (req, res) => {
  res.json({ message: `Welcome, ${req.admin.email}` });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
