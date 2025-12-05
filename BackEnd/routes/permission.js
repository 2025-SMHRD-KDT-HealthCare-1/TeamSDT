const express = require("express");
const router = express.Router();
const db = require("../db/database");

/**
 * 1. 권한 최초 등록 OR 전체 수정
 * POST /permission/agree
 */
router.post("/agree", async (req, res) => {
  console.log("permission body:", req.body);

  const { user_id, alarm, mic, usage } = req.body;

  try {
    // 필수 권한 체크
    if (mic !== 1 || usage !== 1) {
      return res.status(400).json({
        success: false,
        message: "마이크와 사용기록 권한은 필수입니다."
      });
    }

    // 기존 권한 존재 여부 확인
    const [rows] = await db.execute(
      "SELECT * FROM UserPermissions WHERE UserID = ?",
      [user_id]
    );

    if (rows.length === 0) {
      // 없으면 INSERT
      await db.execute(
        `
        INSERT INTO UserPermissions 
        (UserID, AlarmPermission, MicPermission, UsageAccessPermission)
        VALUES (?, ?, ?, ?)
        `,
        [user_id, alarm, mic, usage]
      );
    } else {
      // 있으면 UPDATE
      await db.execute(
        `
        UPDATE UserPermissions
        SET AlarmPermission = ?, MicPermission = ?, UsageAccessPermission = ?
        WHERE UserID = ?
        `,
        [alarm, mic, usage, user_id]
      );
    }

    res.json({
      success: true,
      message: "권한 저장 완료"
    });
  } catch (err) {
    console.error("권한 저장 오류:", err);
    res.status(500).json({
      success: false,
      message: "서버 오류"
    });
  }
});

/**
 * 2. 권한 조회 
 * GET /permission/:user_id
 */
router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM UserPermissions WHERE UserID = ?",
      [user_id]
    );

    if (rows.length === 0) {
      return res.json({
        alarm: 0,
        mic: 0,
        usage: 0
      });
    }

    const data = rows[0];

    res.json({
      alarm: data.AlarmPermission,
      mic: data.MicPermission,
      usage: data.UsageAccessPermission
    });
  } catch (err) {
    console.error("권한 조회 오류:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

/**
 * 3. 마이페이지 알람 ON/OFF 전용 수정
 * POST /permission/alarm
 */
router.post("/alarm", async (req, res) => {
  const { user_id, alarm } = req.body;

  try {
    await db.execute(
      `
      UPDATE UserPermissions
      SET AlarmPermission = ?
      WHERE UserID = ?
      `,
      [alarm, user_id]
    );

    res.json({
      success: true,
      message: "알람 설정 변경 완료"
    });
  } catch (err) {
    console.error("알람 설정 수정 오류:", err);
    res.status(500).json({
      success: false,
      message: "서버 오류"
    });
  }
});

module.exports = router;
