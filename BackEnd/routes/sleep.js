const express = require("express");
const router = express.Router();
const db = require("../db/database");
const axios = require("axios"); // ⭐ AI 호출용 추가

/**
 * 1️⃣ 수면 측정 시작
 */
router.post("/start", async (req, res) => {
  const { userId, sleepTime, wakeTime } = req.body;

  try {
    const [exists] = await db.execute(
      `SELECT SleepRecord_ID 
       FROM SleepRecord 
       WHERE UserID = ?
         AND SleepEnd IS NULL`,
      [userId]
    );

    if (exists.length === 0) {
      await db.execute(
        `INSERT INTO SleepRecord 
         (SleepRecord_ID, UserID, DateValue, TotalSleepTime, SleepStart, SleepEnd, Caffeine_Effect, RunningTime)
         VALUES (UUID(), ?, CURDATE(), 0, DATE_FORMAT(NOW(), '%H:%i'), NULL, 0, '')`,
        [userId]
      );
    }

    await db.execute(
      `REPLACE INTO SleepSetting 
       (SleepSetting_ID, UserID, SleepTime, WakeTime)
       VALUES (UUID(), ?, ?, ?)`,
      [userId, sleepTime, wakeTime]
    );

    await db.execute(
      `UPDATE SleepDetectionState
       SET IsSleeping = 1,
           ScreenOffAt = NULL,
           WakeCandidateAt = NULL
       WHERE UserID = ?`,
      [userId]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("sleep start error:", err);
    res.status(500).json({ message: "수면 시작 저장 오류" });
  }
});

/**
 * 2️⃣ 수면 측정 종료
 */
router.post("/end", async (req, res) => {
  const { userId } = req.body;

  try {
    const [[row]] = await db.execute(
      `SELECT SleepRecord_ID, SleepStart
       FROM SleepRecord 
       WHERE UserID = ?
         AND SleepEnd IS NULL
       ORDER BY DateValue DESC 
       LIMIT 1`,
      [userId]
    );

    if (!row) {
      return res.status(400).json({ message: "진행 중인 수면 기록이 없습니다." });
    }

    const [sh, sm] = row.SleepStart.split(":").map(Number);
    const startMin = sh * 60 + sm;

    const now = new Date();
    const endMin = now.getHours() * 60 + now.getMinutes();

    let diffMin = endMin - startMin;
    if (diffMin < 0) diffMin += 1440;

    await db.execute(
      `UPDATE SleepRecord 
       SET SleepEnd = DATE_FORMAT(NOW(), '%H:%i'),
           TotalSleepTime = ?
       WHERE SleepRecord_ID = ?`,
      [diffMin, row.SleepRecord_ID]
    );

    res.json({ success: true, totalSleepTime: diffMin });
  } catch (err) {
    console.error("sleep end error:", err);
    res.status(500).json({ message: "수면 종료 저장 오류" });
  }
});

/**
 * 3️⃣ result 화면용 최신 기록
 */
router.get("/result/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const [[row]] = await db.execute(
      `SELECT *
       FROM SleepRecord 
       WHERE UserID = ?
       ORDER BY DateValue DESC, SleepStart DESC
       LIMIT 1`,
      [userId]
    );

    res.json(row || {});
  } catch (err) {
    console.error("sleep result error:", err);
    res.status(500).json({ message: "수면 결과 조회 오류" });
  }
});

/**
 * 4️⃣ 자동 수면 판정 엔진
 */
router.post("/screen-event", async (req, res) => {
  const { userId, type, timestamp } = req.body;

  try {
    // ✅ 상태 없으면 생성
    const [[state]] = await db.execute(
      `SELECT * FROM SleepDetectionState WHERE UserID = ?`,
      [userId]
    );

    if (!state) {
      await db.execute(
        `INSERT INTO SleepDetectionState (UserID, ScreenOffAt, IsSleeping, WakeCandidateAt)
         VALUES (?, NULL, 1, NULL)`,
        [userId]
      );
    }

    const [[current]] = await db.execute(
      `SELECT * FROM SleepDetectionState WHERE UserID = ?`,
      [userId]
    );

    /* SCREEN OFF = 잠들었다 */
    if (type === "SCREEN_OFF") {
  await db.execute(
    `UPDATE SleepDetectionState
     SET ScreenOffAt = ?, 
         WakeCandidateAt = NULL,
         IsSleeping = 1          
     WHERE UserID = ?`,
    [timestamp, userId]
  );

  return res.json({ message: "SCREEN_OFF 저장됨 (수면 유지)" });
}
    /* SCREEN ON 처리 */
    if (type === "SCREEN_ON") {
      const onTime = new Date(timestamp);

      // 1️⃣ 기상 후보가 아직 없으면 → 후보 등록만
      if (!current.WakeCandidateAt) {
        await db.execute(
          `UPDATE SleepDetectionState
           SET WakeCandidateAt = ?
           WHERE UserID = ?`,
          [timestamp, userId]
        );

        return res.json({ message: "기상 후보 등록 (아직 기상 아님)" });
      }

      // 2️⃣ 기상 후보가 이미 있으면 → 3분 유지됐는지 검사
      const candidateTime = new Date(current.WakeCandidateAt);
      const diffMin = (onTime - candidateTime) / 60000;

      // 3분 이상 유지 → 진짜 기상 처리
      if (diffMin >= 3) {
        const [[latest]] = await db.execute(
          `SELECT SleepRecord_ID, SleepStart
           FROM SleepRecord
           WHERE UserID = ?
             AND SleepEnd IS NULL
           ORDER BY DateValue DESC
           LIMIT 1`,
          [userId]
        );

        if (latest) {
          const [sh, sm] = latest.SleepStart.split(":").map(Number);
          const startMin = sh * 60 + sm;
          const endMin = onTime.getHours() * 60 + onTime.getMinutes();

          let diff = endMin - startMin;
          if (diff < 0) diff += 1440;

          await db.execute(
            `UPDATE SleepRecord
             SET SleepEnd = ?, TotalSleepTime = ?
             WHERE SleepRecord_ID = ?`,
            [onTime.toTimeString().slice(0, 5), diff, latest.SleepRecord_ID]
          );

          await db.execute(
            `UPDATE SleepDetectionState
             SET WakeCandidateAt = NULL,
                 ScreenOffAt = NULL,
                 IsSleeping = 0
             WHERE UserID = ?`,
            [userId]
          );

          return res.json({ message: "✅ 3분 유지 → 기상 처리 완료" });
        }
      }

      return res.json({ message: "아직 3분 안 됨 → 기상 아님" });
    }

    return res.json({ message: "이벤트 무시됨" });
  } catch (err) {
    console.error("screen-event error:", err);
    res.status(500).json({ message: "스크린 이벤트 처리 오류" });
  }
});


/**
 * 5️⃣ Result 그래프 + AI 분석 API
 */
router.get("/history/:userId", async (req, res) => {
  const { userId } = req.params;
  const { period } = req.query;

  try {
    let dateCondition = "";

    if (period === "day") {
      dateCondition = "AND DateValue = CURDATE()";
    } else if (period === "week") {
      dateCondition = "AND DateValue >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    } else if (period === "month") {
      dateCondition = "AND DateValue >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
    }

    const [rows] = await db.execute(
      `
      SELECT 
        DateValue,
        TotalSleepTime
      FROM SleepRecord
      WHERE UserID = ?
      ${dateCondition}
      AND TotalSleepTime > 0
      ORDER BY DateValue ASC
      `,
      [userId]
    );

    const graph = rows.map((row) => ({
      label: `${row.DateValue.getMonth() + 1}/${row.DateValue.getDate()}`,
      sleep: Number((row.TotalSleepTime / 60).toFixed(1)),
    }));

    let aiResult = null;

    if (rows.length > 0) {
      const latest = rows[rows.length - 1];
      const totalSleepHour = Number((latest.TotalSleepTime / 60).toFixed(1));

      const [[user]] = await db.execute(
        `SELECT Nick FROM User WHERE UserID = ?`,
        [userId]
      );

      const aiResponse = await axios.post("http://localhost:3000/ai", {
        user_name: user?.Nick ?? "사용자",
        caffeine: 0,
        screen_time: 0,
        sleep_time: totalSleepHour,
        style: "친근하게",
      });

      aiResult = {
        summary: aiResponse.data.text,
        problem: "",
        effect: "",
        solution: "",
      };
    }

    res.json({
      graph,
      ai: aiResult,
    });
  } catch (err) {
    console.error("sleep history error:", err);
    res.status(500).json({ message: "수면 히스토리 조회 실패" });
  }
});

module.exports = router;
