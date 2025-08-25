// utils/initSuperAdmin.js
const Admin = require("../module/auth/entity/auth"); // adjust the casing to your file
const bcrypt = require("bcrypt");
require("dotenv").config(); // load env variables

async function createSuperAdmin() {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASS;

    if (!email || !password) {
      console.log("Super admin credentials not set in .env");
      return;
    }

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("Super admin already exists");
      return;
    }

    // Hash password

    // Create super admin
    const superAdmin = new Admin({
      name: "Super Admin",
      email,
      password,
      role: "admin"
    });

    await superAdmin.save();
    console.log("Super admin created successfully!");
  } catch (err) {
    console.error("Error creating super admin:", err);
  }
}

module.exports = createSuperAdmin;
