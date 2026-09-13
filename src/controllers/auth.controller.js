import User from "../models/user.js";
import bcrypt from "bcrypt";

export const loginUser = async (req, res) => {
  console.log("LOGIN CONTROLLER HIT");

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing fields");
      return res.status(400).json({ message: "Email & password required" });
    }

    const user = await User.findOne({ email });

    console.log("User found:", !!user);

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    console.log("Entered:", password);
    console.log("Stored:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Match:", isMatch);

    if (!isMatch) {
      console.log("Password mismatch → blocking login");
      return res.status(401).json({ message: "Invalid password " });
    }

    console.log("Password matched → success");

    const { password: _, ...safeUser } = user.toObject();

    return res.status(200).json({
      message: "Login successful ",
      user: safeUser
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "Server error " });
  }
};

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      domain,
      targetRole,
      experienceLevel,
      knownSkills,
      learningGoals
    } = req.body;

    // basic validation
    if (!name || !email || !password || !domain || !targetRole) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // save user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      domain,
      targetRole,
      experienceLevel,
      knownSkills,
      learningGoals
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};