const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// ✅ AI 결과 JSON 반환 API
router.get("/", (req, res) => {
  try {
    const jsonPath = path.join(__dirname, "../ai/result.json");
    const raw = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(raw);

    res.json(data);
  } catch (err) {
    console.error("AI JSON 읽기 실패:", err);
    res.status(500).json({ message: "AI JSON 읽기 실패" });
  }
});

module.exports = router;
