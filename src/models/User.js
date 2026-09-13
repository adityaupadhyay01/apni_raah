import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // 🔹 BASIC DETAILS
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    // 🔹 CAREER INFO
    domain: {
      type: String,
      required: true,
      enum: ["tech", "non-tech", "arts"]
    },

    targetRole: {
      type: String,
      required: true
    },

    experienceLevel: {
      type: String,
      enum: ["student", "beginner", "intermediate"],
      default: "student"
    },

    // 🔥 CORE INPUT FROM USER
    knownSkills: {
      type: [String], // what user already knows
      default: []
    },

    learningGoals: {
      type: [String], // what user wants to learn
      default: []
    },

    // 🔥 SYSTEM GENERATED (NOT during signup)
    skillScore: {
      type: Number,
      default: 0
    },

    jobReadinessScore: {
      type: Number,
      default: 0
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner"
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;