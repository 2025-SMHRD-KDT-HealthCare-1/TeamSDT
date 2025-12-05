const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

// GET 테스트용
router.get("/", (req, res) => {
  res.send("AI 통계 라우터 정상 동작 중!");
});

// POST → Python AI 실행 (STDIN 방식)
router.post("/", (req, res) => {
  console.log("/ai 라우터 진입!");
  console.log("받은 데이터:", req.body);

  try {
    const pythonFile = path.join(__dirname, "../ai/sleep_ai_wrapper.py");

    // Python 3.11 고정 실행
    const py = spawn("py", ["-3.11", pythonFile]);

    // JSON → Python stdin 으로 전달
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();

    let result = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error("stderr:", data.toString());
    });

    py.stderr.on("data", (err) => {
      console.error("Python stderr:", err.toString());
    });

    py.on("close", (code) => {
      console.log("Python 종료:", code);
      console.log("Python Raw Output:", result);

      if (code !== 0) {
        return res.status(500).json({ error: "Python process error" });
      }

      try {
        // 🔥 이제 result 자체가 JSON 문자열이기 때문에 바로 파싱 가능
        const jsonResult = JSON.parse(result);
        return res.json(jsonResult);
      } catch (err) {
        console.error("JSON 파싱 오류:", err);
        return res.status(500).json({ error: "JSON parsing failed" });
      }
    });
  } catch (err) {
    console.error("서버 오류:", err);
    res.status(500).json({
      success: false,
      error: "서버 내부 오류",
    });
  }
});

module.exports = router;
