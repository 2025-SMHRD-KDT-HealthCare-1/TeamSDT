const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ 회원가입
router.post("/join", async (req, res) => {
  const { user_id, password, nick, email, phone } = req.body;

  try {
    const [idRows] = await db.execute(
      "SELECT user_id FROM users WHERE user_id = ?",
      [user_id]
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
      "INSERT INTO users (user_id, password, nick, email, phone) VALUES (?, ?, ?, ?, ?)";
    await db.execute(sql, [user_id, hashed, nick, email, phone]);

    return res.json({ message: "회원가입 성공" });
  } catch (err) {
    return res.status(500).json({ message: "회원가입 실패", err });
  }
});

// ✅ 로그인 (JWT 발급은 유지)
// ✅ 로그인 (JWT 발급)
router.post("/login", async (req, res) => {
  const { user_id, password } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id]
    );

    if (rows.length === 0)
      return res.status(400).json({ message: "존재하지 않는 아이디" });

    const isMatch = await bcrypt.compare(password, rows[0].password);
    if (!isMatch)
      return res.status(400).json({ message: "비밀번호 틀림" });

    // 🔥 여기만 추가됨 — .env 없을 때도 기본값 사용
    const SECRET = process.env.JWT_SECRET || "mysecretkey";

    const token = jwt.sign(
      { user_id: rows[0].user_id },
      SECRET,
      { expiresIn: "30d" }
    );

    return res.json({
      message: "로그인 성공",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: "로그인 실패", err });
  }
});


// ✅ 아이디 찾기 (이메일 기반)
router.post("/find-id", async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "등록된 이메일이 없습니다." });
    }

    return res.json({
      message: "아이디 조회 성공",
      user_id: rows[0].user_id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "아이디 조회 실패",
      error: err,
    });
  }
});

// ✅ 임시 비밀번호 생성 함수
function generateTempPassword() {
  return Math.random().toString(36).slice(2, 10);
}

// ✅ 비밀번호 재설정
router.post("/reset-password", async (req, res) => {
  const { user_id, email } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE user_id = ? AND email = ?",
      [user_id, email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "정보가 일치하지 않습니다." });
    }

    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 10);

    await db.execute(
      "UPDATE users SET password = ? WHERE user_id = ?",
      [hashed, user_id]
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

// ✅ 아이디 중복 확인
router.get("/check-id", async (req, res) => {
  const { user_id } = req.query;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [user_id]
    );

    if (rows.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    return res.status(500).json({ message: "DB 오류", err });
  }
});

// 회원 정보 조회 (홈 / 마이페이지 공용) - users 테이블 기준 최종본
router.get("/profile/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT user_id, nick, email, phone 
      FROM users 
      WHERE user_id = ? AND is_deleted = 0
      `,
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "회원 정보 없음" });
    }

    return res.json(rows[0]);
    // 반환 예시:
    // {
    //   user_id: "test01",
    //   nick: "민찬",
    //   email: "test@test.com",
    //   phone: "01012345678"
    // }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "회원 정보 조회 실패",
      error: err,
    });
  }
});


module.exports = router;
