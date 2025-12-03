const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// 회원가입
router.post("/join", async (req, res) => {
    const { user_id, password, nick, email, phone } = req.body;

    try {
        // 1) 아이디 중복 체크
        const [idRows] = await db.execute(
            "SELECT user_id FROM users WHERE user_id = ?",
            [user_id]
        );
        if (idRows.length > 0) {
            return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
        }

        // 2) 이메일 중복 체크
        const [emailRows] = await db.execute(
            "SELECT email FROM users WHERE email = ?",
            [email]
        );
        if (emailRows.length > 0) {
            return res.status(400).json({ message: "이미 가입된 이메일입니다." });
        }

        // 3) 비밀번호 암호화 후 저장
        const hashed = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (user_id, password, nick, email, phone) VALUES (?, ?, ?, ?, ?)";
        await db.execute(sql, [user_id, hashed, nick, email, phone]);

        return res.json({ message: "회원가입 성공" });

    } catch (err) {
        return res.status(500).json({ message: "회원가입 실패", err });
    }
});


// 로그인
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

        // JWT 발급
        const token = jwt.sign(
            { user_id: rows[0].user_id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        return res.json({
            message: "로그인 성공",
            token: token
        });

    } catch (err) {
        return res.status(500).json({ message: "로그인 실패", err });
    }
});


// 자동 로그인 검증 API
router.get("/check", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "토큰 없음" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.json({
            message: "유효한 토큰",
            user_id: decoded.user_id
        });

    } catch (err) {
        return res.status(401).json({ message: "토큰 만료 또는 잘못됨" });
    }
});

// 아이디 찾기 (이메일 기반)
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
            user_id: rows[0].user_id
        });
    } catch (err) {
        return res.status(500).json({
            message: "아이디 조회 실패",
            error: err
        });
    }
});

// 임시 비밀번호 생성 함수
function generateTempPassword() {
    // 8자리 임시 비밀번호
    return Math.random().toString(36).slice(2, 10);
}

// 비밀번호 재설정 (임시 비밀번호 발급) → 이메일과 아이디가 매칭 시 비밀번호 재설정
router.post("/reset-password", async (req, res) => {
    const { user_id, email } = req.body;

    try {
        // user_id + email이 매칭되는 계정 찾기
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE user_id = ? AND email = ?",
            [user_id, email]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "정보가 일치하지 않습니다." });
        }

        // 임시 비밀번호 생성
        const tempPassword = generateTempPassword();
        const hashed = await bcrypt.hash(tempPassword, 10);

        // DB 비밀번호 업데이트
        await db.execute(
            "UPDATE users SET password = ? WHERE user_id = ?",
            [hashed, user_id]
        );

        return res.json({
            message: "임시 비밀번호가 발급되었습니다.",
            tempPassword: tempPassword
        });
    } catch (err) {
        return res.status(500).json({
            message: "비밀번호 재설정 실패",
            error: err
        });
    }
});


// 아이디 중복 확인
router.get("/check-id", async (req, res) => {
    const { user_id } = req.query;

    try {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE user_id = ?",
            [user_id]
        );

        if (rows.length > 0) {
            return res.json({ exists: true });  // 아이디 있음
        } else {
            return res.json({ exists: false }); // 아이디 없음
        }

    } catch (err) {
        return res.status(500).json({ message: "DB 오류", err });
    }
});

const auth = require("../middleware/auth");

// 자동로그인 체크
router.get("/auto-login", auth, async (req, res) => {
    try {
        const user_id = req.user.user_id;

        // 유저 정보 가져오기
        const [rows] = await db.execute(
            "SELECT user_id, email, phone FROM users WHERE user_id = ?",
            [user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "유저 정보 없음" });
        }

        return res.json({
            message: "자동로그인 성공",
            user: rows[0]
        });

    } catch (err) {
        return res.status(500).json({ message: "자동로그인 검사 실패", err });
    }
});

module.exports = router;