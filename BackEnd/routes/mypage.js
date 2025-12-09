const express = require("express");
const router = express.Router();
const db = require("../db/database");

/**
 * 1) 사용자 정보 조회
 */
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT userid, nick, email, phone FROM Users WHERE userid = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ message: "서버 오류", err });
  }
});

/**
 * 2) 사용자 정보 수정
 */
router.put("/user/update", async (req, res) => {
  const { userid, nick, email, phone } = req.body;

  try {
    await db.execute(
      "UPDATE Users SET nick = ?, email = ?, phone = ? WHERE userid = ?",
      [nick, email, phone, userid]
    );

    res.json({ message: "회원 정보 수정 완료" });

  } catch (err) {
    res.status(500).json({ message: "서버 오류", err });
  }
});

/**
 * 3) 카페인 기록 조회  (🔥 IntakeTime → created_at 기준으로 정렬)
 */
router.get("/caffeine/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT Caffeine_ID, userid, DrinkType, DrinkSize, 
             Caffeine_Amount, IntakeTime, created_at
      FROM CaffeineLog
      WHERE userid = ?
      ORDER BY created_at DESC
      `,
      [id]
    );

    res.json(rows);

  } catch (err) {
    console.error("GET /caffeine error:", err);
    res.status(500).json({ message: "서버 오류", err });
  }
});

/**
 * 4) 스크린타임 기록 조회 (기존 유지)
 */
router.get("/screentime/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM screentime_logs WHERE userid = ? ORDER BY date DESC",
      [id]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ message: "서버 오류", err });
  }
});

/**
 * ⭐⭐⭐ 새 기능 추가 — 하루 기록 조회 API ⭐⭐⭐
 * 수면 + 스크린타임 + 카페인 총합을 단순 표시용 데이터로 반환
 */

router.get("/day/:userid/:date", async (req, res) => {
  const { userid, date } = req.params;

  try {
    // ✅ 1) 수면 (DateValue 기준)
    const [[sleep]] = await db.execute(
      `
      SELECT TotalSleepTime
      FROM SleepRecord
      WHERE userid = ?
      AND DateValue = ?
      LIMIT 1
      `,
      [userid, date]
    );

    let sleepText = "기록 없음";
    if (sleep?.TotalSleepTime != null) {
      const h = Math.floor(sleep.TotalSleepTime / 60);
      const m = sleep.TotalSleepTime % 60;
      sleepText = `${h}시간 ${m}분`;
    }

    // ✅ 2) 스크린타임 (ScreenTimeRecord + DateValue)
    const [[screen]] = await db.execute(
      `
      SELECT Total_ScreenTime
      FROM ScreenTimeRecord
      WHERE userid = ?
      AND DateValue = ?
      LIMIT 1
      `,
      [userid, date]
    );

    let screenText = "기록 없음";
    if (screen?.Total_ScreenTime != null) {
      const h = Math.floor(screen.Total_ScreenTime / 60);
      const m = screen.Total_ScreenTime % 60;
      screenText = `${h}시간 ${m}분`;
    }

    // ✅ 3) 카페인 (IntakeTime 날짜 기준 SUM)
    const [[caffeine]] = await db.execute(
      `
      SELECT SUM(Caffeine_Amount) AS totalMg
      FROM CaffeineLog
      WHERE userid = ?
      AND DATE(IntakeTime) = ?
      `,
      [userid, date]
    );

    let caffeineText = caffeine?.totalMg
      ? `${caffeine.totalMg}mg`
      : "기록 없음";

    res.json({
      sleep: sleepText,
      screentime: screenText,
      caffeine: caffeineText,
    });
  } catch (err) {
    console.error("날짜별 하루기록 조회 오류:", err);
    res.status(500).json({ message: "날짜별 하루기록 조회 오류" });
  }
});


/**
 * 5) 전체 데이터 삭제 (초기화)
 */
router.delete("/data/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM CaffeineLog WHERE userid = ?", [id]);
    await db.execute("DELETE FROM screentime_logs WHERE userid = ?", [id]);
    await db.execute("DELETE FROM SleepRecord WHERE userid = ?", [id]);

    res.json({ message: "데이터 초기화 완료" });

  } catch (err) {
    res.status(500).json({ message: "서버 오류", err });
  }
});

module.exports = router;
