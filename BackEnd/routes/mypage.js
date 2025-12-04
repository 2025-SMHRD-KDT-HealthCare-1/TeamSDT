const express = require("express");
const router = express.Router();
const db = require("../db/database");


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


router.get("/caffeine/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM caffeine_logs WHERE user_id = ? ORDER BY created_at DESC",
      [id]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({ message: "서버 오류", err });
  }
});


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


router.delete("/data/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM caffeine_logs WHERE user_id = ?", [id]);
    await db.execute("DELETE FROM screentime_logs WHERE user_id = ?", [id]);
    await db.execute("DELETE FROM sleep_logs WHERE user_id = ?", [id]);

    res.json({ message: "데이터 초기화 완료" });

  } catch (err) {
    res.status(500).json({ message: "서버 오류", err });
  }
});


router.delete("/user/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM caffeine_logs WHERE user_id = ?", [id]);
    await db.execute("DELETE FROM screentime_logs WHERE user_id = ?", [id]);
    await db.execute("DELETE FROM sleep_logs WHERE user_id = ?", [id]);
    await db.execute("DELETE FROM users WHERE user_id = ?", [id]);

    res.json({ message: "회원탈퇴 완료" });

  } catch (err) {
    res.status(500).json({ message: "서버 오류", err });
  }
});

module.exports = router;