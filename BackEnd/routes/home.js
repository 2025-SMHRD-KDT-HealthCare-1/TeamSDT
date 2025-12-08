const express = require("express");
const router = express.Router();
const db = require("../db/database");

router.get("/dashboard/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // ✅ 1) 어제 수면 데이터
    const [[sleepRow]] = await db.execute(
      `SELECT SleepStart, SleepEnd, TotalSleepTime 
       FROM SleepRecord 
       WHERE UserID = ?
         AND DateValue = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
         AND SleepEnd IS NOT NULL
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

      sleepTime.hours = parseInt(sleepRow.SleepStart?.slice(0, 2)) || 0;
      sleepTime.minutes = parseInt(sleepRow.SleepStart?.slice(3, 5)) || 0;

      wakeTime.hours = parseInt(sleepRow.SleepEnd?.slice(0, 2)) || 0;
      wakeTime.minutes = parseInt(sleepRow.SleepEnd?.slice(3, 5)) || 0;
    }

    // ✅ 2) 오늘 스마트폰 사용 시간 (임시)
    const screenTime = { hours: 0, minutes: 0 };

    // ✅ 3) 오늘 카페인 섭취량
    const [caffeineRows] = await db.execute(
      `SELECT DrinkType, COUNT(*) AS cups, SUM(Caffeine_Amount) AS totalMg
       FROM CaffeineLog
       WHERE UserID = ?
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
