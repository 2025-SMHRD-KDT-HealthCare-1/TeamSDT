const express = require("express");
const router = express.Router();

// 통합 분석 API
router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    // 1) result.js 계산 API 호출
    const resultRes = await fetch("http://localhost:3000/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const resultData = await resultRes.json();

    // 2) AI 분석 API 호출
    const aiRes = await fetch("http://localhost:3000/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const aiData = await aiRes.json();

    // 3) 두 결과 합쳐서 리턴
    return res.json({
      ...resultData,
      ai: aiData
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Analysis API error" });
  }
});

module.exports = router;
