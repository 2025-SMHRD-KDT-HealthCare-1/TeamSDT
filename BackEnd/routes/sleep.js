const express = require("express");
const router = express.Router();
const db = require("../db/database");

/**
 * ✅ 1️⃣ 수면 측정 시작 (수동 - 테스트/예비용)
 * measure → sleeptimer 진입 시
 */
router.post("/start", async (req, res) => {
  const { userId, sleepTime, wakeTime } = req.body;

  try {
    // ✅ 아직 안 끝난 수면 세션이 있는지 체크 (중복 방지)
    const [exists] = await db.execute(
      `SELECT SleepRecord_ID 
       FROM SleepRecord 
       WHERE UserID = ?
         AND SleepEnd IS NULL`,
      [userId]
    );

    // ✅ 진행 중인 수면이 없을 때만 INSERT
    if (exists.length === 0) {
      await db.execute(
        `INSERT INTO SleepRecord 
         (SleepRecord_ID, UserID, DateValue, TotalSleepTime, SleepStart, SleepEnd, Caffeine_Effect, RunningTime)
         VALUES (UUID(), ?, CURDATE(), 0, DATE_FORMAT(NOW(), '%H:%i'), NULL, 0, '')`,
        [userId]
      );
    }

    // ✅ 수면 설정 저장 (목표 취침 / 목표 기상)
    await db.execute(
      `REPLACE INTO SleepSetting 
       (SleepSetting_ID, UserID, SleepTime, WakeTime)
       VALUES (UUID(), ?, ?, ?)`,
      [userId, sleepTime, wakeTime]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("sleep start error:", err);
    res.status(500).json({ message: "수면 시작 저장 오류" });
  }
});

/**
 * ✅ 2️⃣ 수면 측정 종료 (수동 기상)
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
 * ✅ 3️⃣ result 화면용 수면 데이터 (최신 1건)
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
 * ✅ ✅ ✅ 4️⃣ 자동 수면 판정 엔진 (스크린타임 기반)
 * POST /sleep/screen-event
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
        `INSERT INTO SleepDetectionState (UserID, ScreenOffAt, IsSleeping)
         VALUES (?, NULL, 0)`,
        [userId]
      );
    }

    const [[current]] = await db.execute(
      `SELECT * FROM SleepDetectionState WHERE UserID = ?`,
      [userId]
    );

    const [[setting]] = await db.execute(
      `SELECT SleepTime, WakeTime
       FROM SleepSetting
       WHERE UserID = ?`,
      [userId]
    );

    /* ✅ SCREEN OFF */
    if (type === "SCREEN_OFF") {
      await db.execute(
        `UPDATE SleepDetectionState
         SET ScreenOffAt = ?, IsSleeping = 0
         WHERE UserID = ?`,
        [timestamp, userId]
      );

      return res.json({ message: "SCREEN_OFF 저장됨" });
    }

    /* ✅ SCREEN ON */
    if (type === "SCREEN_ON" && current.ScreenOffAt) {
      const offTime = new Date(current.ScreenOffAt);
      const onTime = new Date(timestamp);

      const diffMin = (onTime - offTime) / 1000 / 60;

      // ✅ 2시간 이상 OFF 유지 → 수면 시작 판정
      if (diffMin >= 120 && current.IsSleeping === 0) {
        const sleepTime = setting?.SleepTime;
        const offMin = offTime.getHours() * 60 + offTime.getMinutes();

        const sleepMin = sleepTime
          ? Number(sleepTime.split(":")[0]) * 60 + Number(sleepTime.split(":")[1])
          : 0;

        if (offMin >= sleepMin) {
          // ✅ 중복 방지
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
               VALUES (UUID(), ?, CURDATE(), 0, ?, NULL, 0, '')`,
              [userId, offTime.toTimeString().slice(0, 5)]
            );

            await db.execute(
              `UPDATE SleepDetectionState
               SET IsSleeping = 1
               WHERE UserID = ?`,
              [userId]
            );
          }
        }
      }

      // ✅ ✅ ✅ 무조건 기상 처리 (IsSleeping 조건 제거)
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
           SET IsSleeping = 0, ScreenOffAt = NULL
           WHERE UserID = ?`,
          [userId]
        );
      }

      return res.json({ message: "SCREEN_ON 처리 완료" });
    }

    res.json({ message: "이벤트 무시됨" });
  } catch (err) {
    console.error("screen-event error:", err);
    res.status(500).json({ message: "스크린 이벤트 처리 오류" });
  }
});

/**
 * ✅ ✅ ✅ 5️⃣ Result 그래프용 수면 히스토리 API
 * GET /sleep/history/:userId?period=day|week|month|all
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
    // ✅ all 은 조건 없음

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

    // ✅ 프론트 그래프용 데이터 가공
    const graph = rows.map((row) => ({
      label: `${row.DateValue.getMonth() + 1}/${row.DateValue.getDate()}`,
      sleep: Number((row.TotalSleepTime / 60).toFixed(1)), // 분 → 시간
    }));

    res.json({
      graph,
      ai: null, // ✅ 나중에 AI 연결용 자리 유지
    });
  } catch (err) {
    console.error("sleep history error:", err);
    res.status(500).json({ message: "수면 히스토리 조회 실패" });
  }
});

module.exports = router;
