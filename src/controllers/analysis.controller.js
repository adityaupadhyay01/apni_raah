import Analysis from "../models/Analysis.js";
import analyzeResume from "../utils/analyzeResume.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");
export const analyzeResumeController = async (req, res) => {
  try {
    const { userId, jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required"
      });
    }

    let resumeText = "";

    // 🔥 If file uploaded (PDF)
    if (req.file) {
      const data = await pdf(req.file.buffer);
      resumeText = data.text;
    } 
    // 🔹 Else use manual text
    else if (req.body.resumeText) {
      resumeText = req.body.resumeText;
    }

    if (!resumeText) {
      return res.status(400).json({
        message: "Resume text or file is required"
      });
    }

    // run analysis
    const result = analyzeResume(jobDescription, resumeText);

    // save to DB
    const analysis = await Analysis.create({
      userId,
      jobDescription,
      resumeText,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      score: result.score
    });

    // response
    res.status(200).json({
      message: "Analysis completed",
      data: analysis,
      suggestion: result.suggestion
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};