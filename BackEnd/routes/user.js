const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post("/join", async (req, res) => {
  const { userid, password, nick, email, phone } = req.body;

  try {
    const [idRows] = await db.execute(
      "SELECT userid FROM users WHERE userid = ?",
      [userid]
    );
    if (idRows.length > 0) {
      return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
    }

    const [emailRows] = await db.execute(
      "SELECT email FROM users WHERE email = ?",
      [email]
    );
    if (emailRows.length > 0) {
      return res.status(400).json({ message: "이미 가입된 이메일입니다." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users (userid, password, nick, email, phone) VALUES (?, ?, ?, ?, ?)";
    await db.execute(sql, [userid, hashed, nick, email, phone]);

    return res.json({ message: "회원가입 성공" });
  } catch (err) {
    return res.status(500).json({ message: "회원가입 실패", err });
  }
});


router.post("/login", async (req, res) => {
  const { userid, password } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE userid = ?",
      [userid]
    );

    if (rows.length === 0)
      return res.status(400).json({ message: "존재하지 않는 아이디" });

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch)
      return res.status(400).json({ message: "비밀번호 틀림" });

    const SECRET = process.env.JWT_SECRET || "mysecretkey";

    // JWT 발급
    const token = jwt.sign(
      { userid: rows[0].userid },
      SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      message: "로그인 성공",
      token: token,
      userid: rows[0].userid,
    });
  } catch (err) {
    return res.status(500).json({ message: "로그인 실패", err });
  }
});


router.post("/find-id", async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT userid FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "등록된 이메일이 없습니다." });
    }

    return res.json({
      message: "아이디 조회 성공",
      userid: rows[0].userid,
    });
  } catch (err) {
    return res.status(500).json({
      message: "아이디 조회 실패",
      error: err,
    });
  }
});



function generateTempPassword() {
  return Math.random().toString(36).slice(2, 10);
}

router.post("/reset-password", async (req, res) => {
  const { userid, email } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE userid = ? AND email = ?",
      [userid, email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "정보가 일치하지 않습니다." });
    }

    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 10);

    await db.execute(
      "UPDATE users SET password = ? WHERE userid = ?",
      [hashed, userid]
    );

    return res.json({
      message: "임시 비밀번호가 발급되었습니다.",
      tempPassword: tempPassword,
    });
  } catch (err) {
    return res.status(500).json({
      message: "비밀번호 재설정 실패",
      error: err,
    });
  }
});



router.get("/check-id", async (req, res) => {
  const { userid } = req.query;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE userid = ?",
      [userid]
    );

    return res.json({ exists: rows.length > 0 });
  } catch (err) {
    return res.status(500).json({ message: "DB 오류", err });
  }
});



router.get("/profile/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT userid, nick, email, phone 
      FROM users 
      WHERE userid = ? AND is_deleted = 0
      `,
      [userid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "회원 정보 없음" });
    }

    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({
      message: "회원 정보 조회 실패",
      error: err,
    });
  }
});



router.get("/me", async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ message: "토큰 없음" });
    }

    const token = auth.replace("Bearer ", "");
    const SECRET = process.env.JWT_SECRET || "mysecretkey";

    const decoded = jwt.verify(token, SECRET);
    const userid = decoded.userid;

    const [rows] = await db.execute(
      "SELECT userid, nick, email, phone FROM users WHERE userid = ? AND is_deleted = 0",
      [userid]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "회원 정보 없음" });
    }

    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "내 정보 조회 실패", error: err });
  }
});



router.delete("/delete/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE userid = ? AND is_deleted = 0",
      [userid]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "이미 탈퇴했거나 존재하지 않는 회원입니다.",
      });
    }

    await db.execute(
      "UPDATE users SET is_deleted = 1 WHERE userid = ?",
      [userid]
    );

    return res.json({ message: "회원탈퇴 완료" });
  } catch (err) {
    return res.status(500).json({
      message: "회원탈퇴 실패",
      error: err,
    });
  }
});



module.exports = router;