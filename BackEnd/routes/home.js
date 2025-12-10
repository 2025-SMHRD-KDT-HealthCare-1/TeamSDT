const express = require("express");
const router = express.Router();
const db = require("../db/database");

router.get("/dashboard/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    // ✅ 1) 최근 수면 기록 1건 가져오기
    const [[sleepRow]] = await db.execute(
      `
      SELECT SleepStart, SleepEnd, TotalSleepTime, DateValue
      FROM SleepRecord
      WHERE userid = ?
        AND SleepEnd IS NOT NULL
      ORDER BY DateValue DESC, SleepStart DESC
      LIMIT 1
      `,
      [userid]
    );

    let totalSleep = { hours: 0, minutes: 0 };
    let sleepTime = { hours: 0, minutes: 0 };
    let wakeTime = { hours: 0, minutes: 0 };

    if (sleepRow) {
      const totalMin = sleepRow.TotalSleepTime ?? 0;

      totalSleep = {
        hours: Math.floor(totalMin / 60),
        minutes: totalMin % 60,
      };

      sleepTime = {
        hours: parseInt(sleepRow.SleepStart?.slice(0, 2)) || 0,
        minutes: parseInt(sleepRow.SleepStart?.slice(3, 5)) || 0,
      };

      wakeTime = {
        hours: parseInt(sleepRow.SleepEnd?.slice(0, 2)) || 0,
        minutes: parseInt(sleepRow.SleepEnd?.slice(3, 5)) || 0,
      };
    }

    // ✅ 2) 최근 스크린타임 1건
    const [[screenRow]] = await db.execute(
      `
      SELECT Total_ScreenTime
      FROM ScreenTimeRecord
      WHERE userid = ?
      ORDER BY DateValue DESC
      LIMIT 1
      `,
      [userid]
    );

    let screenTime = { hours: 0, minutes: 0 };
    if (screenRow) {
      screenTime = {
        hours: Math.floor(screenRow.Total_ScreenTime / 60),
        minutes: screenRow.Total_ScreenTime % 60,
      };
    }

    // ✅ 3) 최근 카페인 기록 (하루 총합)
    const [caffeineRows] = await db.execute(
      `
      SELECT 
        COUNT(*) AS cups, 
        SUM(Caffeine_Amount) AS totalMg
      FROM CaffeineLog
      WHERE userid = ?
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at) DESC
      LIMIT 1
      `,
      [userid]
    );

    let caffeine = { type: "종류 정보 없음", cups: 0, mg: 0 };

    if (caffeineRows.length > 0) {
      const latest = caffeineRows[0];
      caffeine = {
        type: "종류 정보 없음",   // DrinkType 제거했기 때문에 기본값 유지
        cups: latest.cups,
        mg: latest.totalMg,
      };
    }

    // 🔥 최종 응답
    res.json({
      totalSleep,
      sleepTime,
      wakeTime,
      screenTime,
      caffeine,
    });

  } catch (err) {
    console.error("home dashboard error:", err);
    res.status(500).json({ message: "홈 데이터 조회 오류" });
  }
});

module.exports = router;
