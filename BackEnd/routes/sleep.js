const express = require("express");
const router = express.Router();
const db = require("../db/database");
const axios = require("axios"); // ⭐ AI 호출용 추가

/**
 * 1️⃣ 수면 측정 시작
 */
router.post("/start", async (req, res) => {
  const { userid, sleepTime, wakeTime } = req.body;

  try {
    const now = new Date();
    const hour = now.getHours();
    let dateValue;

    if (hour < 5) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      dateValue = yesterday.toISOString().slice(0, 10);
    } else {
      dateValue = now.toISOString().slice(0, 10);
    }

    const [exists] = await db.execute(
      `SELECT SleepRecord_ID 
       FROM SleepRecord 
       WHERE userid = ?
         AND SleepEnd IS NULL`,
      [userid]
    );

    if (exists.length === 0) {
      await db.execute(
        `INSERT INTO SleepRecord 
         (SleepRecord_ID, userid, DateValue, TotalSleepTime, SleepStart, SleepEnd, Caffeine_Effect, RunningTime)
         VALUES (UUID(), ?, ?, 0, DATE_FORMAT(NOW(), '%H:%i'), NULL, 0, '')`,
        [userid, dateValue]
      );
    }

    await db.execute(
      `REPLACE INTO SleepSetting 
       (SleepSetting_ID, userid, SleepTime, WakeTime)
       VALUES (UUID(), ?, ?, ?)`,
      [userid, sleepTime, wakeTime]
    );

    await db.execute(
      `UPDATE SleepDetectionState
       SET IsSleeping = 1,
           ScreenOffAt = NULL,
           WakeCandidateAt = NULL
       WHERE userid = ?`,
      [userid]
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
  const { userid } = req.body;

  try {
    const [[row]] = await db.execute(
      `SELECT SleepRecord_ID, SleepStart
       FROM SleepRecord 
       WHERE userid = ?
         AND SleepEnd IS NULL
       ORDER BY DateValue DESC 
       LIMIT 1`,
      [userid]
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
router.get("/result/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    const [[row]] = await db.execute(
      `SELECT *
       FROM SleepRecord 
       WHERE userid = ?
       ORDER BY DateValue DESC, SleepStart DESC
       LIMIT 1`,
      [userid]
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
  const { userid, type, timestamp } = req.body;

  try {
    // ✅ 상태 없으면 생성
    const [[state]] = await db.execute(
      `SELECT * FROM SleepDetectionState WHERE userid = ?`,
      [userid]
    );

    if (!state) {
      await db.execute(
        `INSERT INTO SleepDetectionState (userid, ScreenOffAt, IsSleeping, WakeCandidateAt)
         VALUES (?, NULL, 1, NULL)`,
        [userid]
      );
    }

    const [[current]] = await db.execute(
      `SELECT * FROM SleepDetectionState WHERE userid = ?`,
      [userid]
    );

    /* SCREEN OFF = 잠들었다 */
    if (type === "SCREEN_OFF") {
  await db.execute(
    `UPDATE SleepDetectionState
     SET ScreenOffAt = ?, 
         WakeCandidateAt = NULL,
         IsSleeping = 1          
     WHERE userid = ?`,
    [timestamp, userid]
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
           WHERE userid = ?`,
          [timestamp, userid]
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
           WHERE userid = ?
             AND SleepEnd IS NULL
           ORDER BY DateValue DESC
           LIMIT 1`,
          [userid]
        );

        // ✅ 1️⃣ 코골이 원본 AI 불러오기
        const aiRaw = await axios.get("http://localhost:3000/ai-json");

        // ✅ 2️⃣ Gemini 요약 실행
        const aiGemini = await axios.get("http://localhost:3000/ai-gemini");

        // ✅ 3️⃣ 수면 기록에 같이 저장
        await db.execute(
            `UPDATE SleepRecord
            SET 
              SnoringResult = ?,
              AI_Summary = ?
            WHERE SleepRecord_ID = ?`,
          [
            aiRaw.data.prediction,
            aiGemini.data.ai_comment,
            latest.SleepRecord_ID
          ]
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
             WHERE userid = ?`,
            [userid]
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
 * 5️⃣ 히스토리 + AI 분석
 */
router.get("/history/:userid", async (req, res) => {
  const { userid } = req.params;
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
      WHERE userid = ?
      ${dateCondition}
      AND TotalSleepTime > 0
      ORDER BY DateValue ASC
      `,
      [userid]
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
        `SELECT Nick FROM Users WHERE userid = ?`,
        [userid]
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

/**
 * 6️⃣ 기존 하루 수면 조회 API
 */
router.get("/daily/:userid/:date", async (req, res) => {
  const { userid, date } = req.params;

  try {
    const [[row]] = await db.execute(
      `
      SELECT TotalSleepTime, SleepStart, SleepEnd
      FROM SleepRecord
      WHERE userid = ?
        AND DATE(DateValue) = ?
      LIMIT 1
      `,
      [userid, date]
    );

    res.json(row || null);
  } catch (err) {
    console.error("sleep daily error:", err);
    res.status(500).json({ message: "하루 수면 조회 오류" });
  }
});

/**
 * 7️⃣ 마이페이지 하루 통합 기록 조회
 */
router.get("/day/:userid/:date", async (req, res) => {
  const { userid, date } = req.params;

  try {
    const [[sleepRow]] = await db.execute(
      `SELECT TotalSleepTime 
       FROM SleepRecord 
       WHERE userid = ? AND DATE(DateValue) = ?`,
      [userid, date]
    );

    const sleepText = sleepRow
      ? `${Math.floor(sleepRow.TotalSleepTime / 60)}시간 ${sleepRow.TotalSleepTime % 60}분`
      : "기록 없음";

    const [[screenRow]] = await db.execute(
      `SELECT Total_ScreenTime 
       FROM ScreenTimeRecord 
       WHERE userid = ? AND DATE(DateValue) = ?`,
      [userid, date]
    );

    const screenText = screenRow
      ? `${Math.floor(screenRow.Total_ScreenTime / 60)}시간 ${
          screenRow.Total_ScreenTime % 60
        }분`
      : "기록 없음";

    const [caffeineRows] = await db.execute(
      `SELECT Caffeine_Amount 
       FROM CaffeineLog 
       WHERE userid = ? AND DATE(created_at) = ?`,
      [userid, date]
    );

    const totalCaffeine = caffeineRows.reduce(
      (s, r) => s + Number(r.Caffeine_Amount),
      0
    );

    const caffeineText =
      caffeineRows.length > 0 ? `${totalCaffeine}mg` : "기록 없음";

    res.json({
      sleep: sleepText,
      screentime: screenText,
      caffeine: caffeineText,
    });
  } catch (err) {
    console.error("GET /sleep/day error:", err);
    res.status(500).json({ message: "하루 기록 통합 조회 오류" });
  }
});

module.exports = router;
