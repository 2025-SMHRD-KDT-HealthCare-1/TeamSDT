const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

router.post("/", (req, res) => {
  console.log("\n===== /ai 요청 도착 =====");
  console.log("받은 데이터:", req.body);

  try {
    const pythonFile = path.join(__dirname, "../ai/sleep_ai_wrapper.py");

    // ⭐ Windows → py, Mac/Linux → python3
    const pythonCmd = process.platform === "win32" ? "py" : "python3";

    const py = spawn(pythonCmd, [pythonFile]);

    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();

    let result = "";
    let errLog = "";

    py.stdout.on("data", (data) => (result += data.toString()));
    py.stderr.on("data", (data) => (errLog += data.toString()));

    py.on("close", (code) => {
      console.log("Python 종료 코드:", code);

      if (errLog.trim()) console.log("⚠ Python stderr:", errLog);

      if (code !== 0) {
        return res.status(500).json({ error: "Python 실행 실패" });
      }

      try {
        const json = JSON.parse(result);
        res.json(json);
      } catch (err) {
        console.log("❌ JSON 파싱 오류");
        console.log("Raw:", result);
        res.status(500).json({ error: "JSON parse error" });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 내부 오류" });
  }
});

module.exports = router;
