const express = require("express");
const router = express.Router();
const { analyzeSkills } = require("../controllers/analyzeController");

router.post("/analyze", analyzeSkills);

module.exports = router;