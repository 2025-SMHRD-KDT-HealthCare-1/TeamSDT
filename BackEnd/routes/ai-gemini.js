const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// ✅ Gemini로 보낼 프롬프트 생성
function makePrompt(json) {
  return `
당신은 수면 분석 전문가입니다.

아래는 사용자의 코골이 분석 결과입니다.

- 파일: ${json.file}
- 판정: ${json.prediction}
- 코골이 확률: ${json.probability.snoring}
- 정상 수면 확률: ${json.probability.no_snoring}

이 데이터를 기반으로 다음을 한국어로 작성해 주세요.

1. 오늘 수면 상태 한 줄 요약
2. 건강 위험도 (매우 낮음 / 낮음 / 보통 / 높음 / 매우 높음)
3. 내일을 위한 수면 개선 조언 (2~3문장)

과장하지 말고, 친절하게 설명해주세요.
`;
}

// ✅ 실제 Gemini 호출 함수
async function sendToGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  // ✅ 여기 반드시 추가
  console.log("✅ 현재 로딩된 GEMINI_API_KEY =", apiKey);

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY가 서버에 로드되지 않았습니다.");
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: prompt }] }
        ]
      })
    }
  );

  const data = await res.json();
  console.log("✅ Gemini RAW 응답:", JSON.stringify(data, null, 2));

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "AI 응답 생성 실패";

  return text;
}

// ✅ Gemini 분석 API
router.get("/", async (req, res) => {
  try {
    // 1️⃣ AI JSON 불러오기
    const jsonPath = path.join(__dirname, "../ai/result.json");
    const raw = fs.readFileSync(jsonPath, "utf8");
    const jsonData = JSON.parse(raw);

    // 2️⃣ 프롬프트 생성
    const prompt = makePrompt(jsonData);

    // 3️⃣ Gemini 호출
    const aiText = await sendToGemini(prompt);

    // 4️⃣ 최종 응답
    res.json({
      raw: jsonData,
      ai_comment: aiText
    });

  } catch (err) {
  console.error("🔥 Gemini 연동 실패 FULL ERROR ↓↓↓");
  console.error(err?.response?.data || err);
  res.status(500).json({
    message: "Gemini 연동 실패",
    error: err?.response?.data || err.toString() });
  }
});

module.exports = router;
