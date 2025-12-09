const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { v4: uuidv4 } = require("uuid");

/**
 * 1️⃣ 스크린타임 업로드
 *  ⬅ DB 컬럼에 맞게 Top_App → App_Name 으로 변경
 */
router.post("/upload", async (req, res) => {
  try {
    const { user_id, date, apps } = req.body;

    if (!apps || apps.length === 0) {
      return res.status(400).json({ message: "앱 데이터 없음" });
    }

    const sorted = apps.sort((a, b) => b.minutes - a.minutes);
    const top5 = sorted.slice(0, 5);

    const topNames = top5.map((a) => a.name).join(",");
    const topTimes = top5.map((a) => a.minutes).join(",");

    const totalUsage = apps.reduce((sum, a) => sum + a.minutes, 0);

    // 🔥 DB 컬럼명에 맞게 수정: Top_App → App_Name
    const sql = `
      INSERT INTO ScreenTimeRecord 
      (ScreenTime_ID, userid, DateValue, Total_ScreenTime, App_Name, Usage_Time)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      uuidv4(),
      user_id,
      date,
      totalUsage,
      topNames,
      topTimes,
    ];

    await db.execute(sql, params);

    res.json({ message: "스크린타임 저장 완료" });
  } catch (err) {
    console.error("screen upload error:", err);
    res.status(500).json({ message: "서버 오류", err });
  }
});


/**
 * 2️⃣ 스크린타임 날짜별 조회 (기존)
 * ⬅ DB와 컬럼이 다르던 부분 수정: Top_App → App_Name
 */
router.get("/day/:user_id/:date", async (req, res) => {
  try {
    const { user_id, date } = req.params;

    const sql = `
      SELECT * FROM ScreenTimeRecord
      WHERE userid = ? AND DateValue = ?
    `;

    const [rows] = await db.execute(sql, [user_id, date]);

    if (rows.length === 0) {
      return res.json({ message: "데이터 없음" });
    }

    const row = rows[0];

    // 🔥 컬럼명 수정
    const names = row.App_Name.split(",");
    const times = row.Usage_Time.split(",").map(Number);

    const apps = names.map((name, i) => ({
      name,
      minutes: times[i],
    }));

    res.json({
      date: row.DateValue,
      total: row.Total_ScreenTime,
      apps,
    });
  } catch (err) {
    console.error("screen day error:", err);
    res.status(500).json({ message: "서버 오류", err });
  }
});

/**
 * ⭐ 3️⃣ 마이페이지 simple API
 */
router.get("/simple/:userid/:date", async (req, res) => {
  const { userid, date } = req.params;

  try {
    const [[row]] = await db.execute(
      `
      SELECT Total_ScreenTime 
      FROM ScreenTimeRecord 
      WHERE userid = ? AND DateValue = ?
      `,
      [userid, date]
    );

    if (!row) {
      return res.json({ screentime: "기록 없음" });
    }

    const total = row.Total_ScreenTime;
    const text = `${Math.floor(total / 60)}시간 ${total % 60}분`;

    res.json({ screentime: text });
  } catch (err) {
    console.error("screen simple error:", err);
    res.status(500).json({ message: "스크린타임 조회 오류" });
  }
});

module.exports = router;
