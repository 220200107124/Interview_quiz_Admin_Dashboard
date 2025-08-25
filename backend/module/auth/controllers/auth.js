const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Auth = require("../entity/auth");

const login = async (req, res) => {
     try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // Find admin in DB
    const admin = await Auth.findOne({ email });
    if (!admin)
      return res.status(401).json({ message: "Invalid email or password" });

    // Compare password

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET, // use process.env
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports  = {login}