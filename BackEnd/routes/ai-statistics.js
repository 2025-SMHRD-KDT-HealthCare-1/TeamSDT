const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

router.post("/", (req, res) => {
  console.log("💡 /ai 라우터 실행됨");
  console.log("받은 데이터:", req.body);

  // OS에 따라 Python 명령 선택
  const pythonCmd = process.platform === "win32" ? "py" : "python3";
  console.log("사용되는 Python 명령:", pythonCmd);

  try {
    const pythonFile = path.join(__dirname, "../ai/sleep_ai_wrapper.py");

    // Python 스크립트 실행
    const py = spawn(pythonCmd, [pythonFile]);

    // Python에게 데이터 전달(JSON)
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();

    let result = "";
    let errLog = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      errLog += data.toString();
    });

    py.on("close", (code) => {
      console.log("Python 종료 코드:", code);

      if (errLog.trim().length > 0) {
        console.log("⚠️ Python stderr:", errLog);
      }

      if (code !== 0) {
        return res.status(500).json({ error: "Python process error" });
      }

      try {
        const jsonResult = JSON.parse(result);
        res.json(jsonResult);
      } catch (err) {
        console.error("❌ JSON 파싱 오류:", err);
        console.log("📌 Raw Output:", result);
        res.status(500).json({ error: "JSON parsing failed" });
      }
    });
  } catch (err) {
    console.error("서버 오류:", err);
    res.status(500).json({ success: false, error: "서버 내부 오류" });
  }
});

module.exports = router;
