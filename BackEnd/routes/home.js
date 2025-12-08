const express = require("express");
const router = express.Router();
const db = require("../db/database");

// 홈 대시보드 데이터 조회
router.get("/dashboard/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // 1) 오늘 수면 데이터
    const [[sleepRow]] = await db.execute(
      `SELECT SleepStart, SleepEnd, TotalSleepTime 
       FROM SleepRecord 
       WHERE UserID = ? 
       ORDER BY DateValue DESC 
       LIMIT 1`,
      [userId]
    );

    let totalSleep = { hours: 0, minutes: 0 };
    let sleepTime = { hours: 0, minutes: 0 };
    let wakeTime = { hours: 0, minutes: 0 };

    if (sleepRow) {
      const totalMin = sleepRow.TotalSleepTime || 0;
      totalSleep.hours = Math.floor(totalMin / 60);
      totalSleep.minutes = totalMin % 60;

      const start = new Date(sleepRow.SleepStart);
      const end = new Date(sleepRow.SleepEnd);

      sleepTime.hours = start.getHours();
      sleepTime.minutes = start.getMinutes();

      wakeTime.hours = end.getHours();
      wakeTime.minutes = end.getMinutes();
    }

    // 2) 오늘 스마트폰 사용 시간
    const [[screenRow]] = await db.execute(
      `SELECT SUM(UsageMinutes) AS total 
       FROM ScreenTime 
       WHERE UserID = ? 
       AND DATE(UsedAt) = CURDATE()`,
      [userId]
    );

    const totalScreenMin = screenRow?.total || 0;
    const screenTime = {
      hours: Math.floor(totalScreenMin / 60),
      minutes: totalScreenMin % 60
    };

    // 3) 오늘 카페인 섭취량
    const [caffeineRows] = await db.execute(
      `SELECT DrinkType, COUNT(*) AS cups, SUM(Caffeine_Amount) AS totalMg
       FROM CaffeineLog
       WHERE UserID = ?
       AND DATE(IntakeTime) = CURDATE()
       GROUP BY DrinkType
       ORDER BY totalMg DESC`,
      [userId]
    );

    let caffeine = { type: "없음", cups: 0, mg: 0 };

    if (caffeineRows.length > 0) {
      caffeine.type = caffeineRows[0].DrinkType;
      caffeine.cups = caffeineRows.reduce((s, r) => s + r.cups, 0);
      caffeine.mg = caffeineRows.reduce((s, r) => s + r.totalMg, 0);
    }

    // 최종 응답
    res.json({
      totalSleep,
      sleepTime,
      wakeTime,
      screenTime,
      caffeine
    });

  } catch (err) {
    console.error("home dashboard error:", err);
    res.status(500).json({ message: "홈 데이터 조회 오류" });
  }
});

module.exports = router;
