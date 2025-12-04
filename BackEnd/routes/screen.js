const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { v4: uuidv4 } = require("uuid");

router.post("/upload", async (req, res) => {
  try {
    const { user_id, date, apps } = req.body;

    if (!apps || apps.length === 0) {
      return res.status(400).json({ message: "앱 데이터 없음" });
    }

    const sorted = apps.sort((a, b) => b.minutes - a.minutes);

    const top5 = sorted.slice(0, 5);

    const topNames = top5.map(a => a.name).join(",");
    const topTimes = top5.map(a => a.minutes).join(",");

    const totalUsage = apps.reduce((sum, a) => sum + a.minutes, 0);

    const sql = `
      INSERT INTO ScreenTimeRecord 
      (ScreenTime_ID, UserID, DateValue, Total_ScreenTime, Top_App, Usage_Time)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [
      uuidv4(),
      user_id,
      date,
      totalUsage,
      topNames,
      topTimes
    ];

    await db.execute(sql, params);

    res.json({ message: "스크린타임 저장 완료" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류", err });
  }
});

router.get("/day/:user_id/:date", async (req, res) => {
  try {
    const { user_id, date } = req.params;

    const sql = `
      SELECT * FROM ScreenTimeRecord
      WHERE UserID = ? AND DateValue = ?
    `;

    const [rows] = await db.execute(sql, [user_id, date]);

    if (rows.length === 0) {
      return res.json({ message: "데이터 없음" });
    }

    const row = rows[0];

    const names = row.Top_App.split(",");
    const times = row.Usage_Time.split(",").map(Number);

    const apps = names.map((name, i) => ({
      name,
      minutes: times[i]
    }));

    res.json({
      date: row.DateValue,
      total: row.Total_ScreenTime,
      apps
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류", err });
  }
});

module.exports = router;
