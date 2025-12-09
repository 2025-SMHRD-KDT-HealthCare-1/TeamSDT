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
      "SELECT user_id, nick, email, phone FROM users WHERE user_id = ?",
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
  const { user_id, nick, email, phone } = req.body;

  try {
    await db.execute(
      "UPDATE users SET nick = ?, email = ?, phone = ? WHERE user_id = ?",
      [nick, email, phone, user_id]
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
      SELECT Caffeine_ID, UserID, DrinkType, DrinkSize, 
             Caffeine_Amount, IntakeTime, created_at
      FROM CaffeineLog
      WHERE UserID = ?
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
      "SELECT * FROM screentime_logs WHERE user_id = ? ORDER BY date DESC",
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
router.get("/day/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // ✅ 1) 수면 (created_at 기준 오늘)
    const [[sleep]] = await db.execute(
      `
      SELECT TotalSleepTime
      FROM SleepRecord
      WHERE UserID = ?
      AND DATE(created_at) = CURDATE()
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    let sleepText = "기록 없음";
    if (sleep?.TotalSleepTime != null) {
      const h = Math.floor(sleep.TotalSleepTime / 60);
      const m = sleep.TotalSleepTime % 60;
      sleepText = `${h}시간 ${m}분`;
    }

    // ✅ 2) 스크린타임 (created_at 기준 오늘)
    const [[screen]] = await db.execute(
      `
      SELECT Total_ScreenTime
      FROM ScreenTimeRecord
      WHERE UserID = ?
      AND DATE(created_at) = CURDATE()
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    let screenText = "기록 없음";
    if (screen?.Total_ScreenTime != null) {
      const h = Math.floor(screen.Total_ScreenTime / 60);
      const m = screen.Total_ScreenTime % 60;
      screenText = `${h}시간 ${m}분`;
    }

    // ✅ 3) 카페인 (created_at 기준 오늘)
    const [[caffeine]] = await db.execute(
      `
      SELECT SUM(Caffeine_Amount) AS totalMg
      FROM CaffeineLog
      WHERE UserID = ?
      AND DATE(created_at) = CURDATE()
      `,
      [userId]
    );

    let caffeineText = caffeine?.totalMg ? `${caffeine.totalMg}mg` : "기록 없음";

    res.json({
      sleep: sleepText,
      screentime: screenText,
      caffeine: caffeineText,
    });

  } catch (err) {
    console.error("하루 기록 조회 오류:", err);
    res.status(500).json({ message: "하루 기록 조회 오류" });
  }
});


/**
 * 5) 전체 데이터 삭제 (초기화)
 */
router.delete("/data/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM CaffeineLog WHERE UserID = ?", [id]);
    await db.execute("DELETE FROM screentime_logs WHERE user_id = ?", [id]);
    await db.execute("DELETE FROM SleepRecord WHERE UserID = ?", [id]);

    res.json({ message: "데이터 초기화 완료" });

  } catch (err) {
    res.status(500).json({ message: "서버 오류", err });
  }
});

module.exports = router;
