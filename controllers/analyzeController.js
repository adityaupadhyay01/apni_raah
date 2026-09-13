const roles = require("../data/roles.json");

exports.analyzeSkills = (req, res) => {
  const { role, userSkills } = req.body;

  if (!role || !userSkills) {
    return res.status(400).json({ error: "Missing data" });
  }

  const roleData = roles[role];

  if (!roleData) {
    return res.status(404).json({ error: "Role not found" });
  }

  const requiredSkills = roleData.skills;

  const missingSkills = requiredSkills.filter(
    skill => !userSkills.includes(skill)
  );

  const score =
    ((requiredSkills.length - missingSkills.length) /
      requiredSkills.length) * 100;

  res.json({
    score: Math.round(score),
    missingSkills,
    roadmap: roleData.roadmap,
    timeToReady: roleData.timeToReady,
    competition: roleData.competition
  });
};