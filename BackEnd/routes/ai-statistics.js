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

    py.stderr.on("data", (err) => {
      console.error("Python stderr:", err.toString());
    });

    py.on("close", (code) => {
      console.log("Python 종료 코드:", code);

      if (code !== 0) {
        return res.status(500).json({
          success: false,
          error: "Python 실행 중 오류 발생",
        });
      }

      return res.json({
        success: true,
        answer: result.trim(),
      });
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
