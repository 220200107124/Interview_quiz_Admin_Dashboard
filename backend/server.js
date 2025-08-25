
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routes = require("./routes/routeManager");
const createSuperAdmin = require("./utils/initSuperAdmin");
const cors = require("cors");
const bodyparser = require("body-parser");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

// Use route manager
app.use("/api", routes);

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("MongoDB connected");
    createSuperAdmin();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
