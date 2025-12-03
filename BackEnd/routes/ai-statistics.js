const express = require("express");
const router = express.Router();  // 이 줄이 반드시 필요합니다
const { spawn } = require("child_process");
const path = require("path");

router.post("/", (req, res) => {
  console.log("/ai 라우터에 진입함!");
  const pythonFile = path.join(__dirname, "../ai/sleep_ai_wrapper.py");

  try {
    const py = spawn("python", [pythonFile]);

    // JSON 형식으로 Python에 전달
    py.stdin.write(JSON.stringify(req.body));
    py.stdin.end();
    console.log("Post Body:", req.body);

    let result = "";

    py.stdout.on("data", (data) => {
      result += data.toString();
    });

    py.stderr.on("data", (data) => {
      console.error("stderr:", data.toString());
    });

    py.on("close", (code) => {
      console.log(`Python 종료: ${code}`);
      
      if (code !== 0) {
        return res.status(500).json({ error: "Python 프로세스 오류" });
      }

      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      return res.send(result.trim());
    });
  } catch (err) {
    console.error("서버 오류:", err);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});

// 마지막에 router를 export
module.exports = router;
