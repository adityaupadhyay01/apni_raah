import skillsList from "./skillsList.js";

const extractSkills = (text) => {
  const lowerText = text.toLowerCase();

  return skillsList.filter(skill =>
    lowerText.includes(skill)
  );
};

const analyzeResume = (jobDesc, resume) => {
  const jdSkills = extractSkills(jobDesc);
  const resumeSkills = extractSkills(resume);

  const matched = jdSkills.filter(skill =>
    resumeSkills.includes(skill)
  );

  const missing = jdSkills.filter(skill =>
    !resumeSkills.includes(skill)
  );

  const score =
    jdSkills.length === 0
      ? 0
      : (matched.length / jdSkills.length) * 100;

  let suggestion = "";

  if (score < 40) {
    suggestion = "You are missing core skills. Focus on fundamentals.";
  } else if (score < 70) {
    suggestion = "Good progress. Improve missing skills and build projects.";
  } else {
    suggestion = "Strong profile. Start applying for jobs.";
  }

  return {
    matchedSkills: matched,
    missingSkills: missing,
    score: Math.round(score),
    suggestion
  };
};

export default analyzeResume;