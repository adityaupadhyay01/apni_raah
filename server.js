const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/skill-platform")
  .then(() => console.log("MongoDB connected "))
  .catch(err => console.log("DB Error:", err));

// routes
const analyzeRoute = require("./routes/analyze");
app.use("/api", analyzeRoute);

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});