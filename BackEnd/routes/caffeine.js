const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { v4: uuidv4 } = require("uuid");

/* -------------------------------------------------------
 * 1️⃣ 전체 브랜드 조회
 * -----------------------------------------------------*/
router.get("/brands", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT DISTINCT brand FROM CaffeineMenu ORDER BY brand"
    );
    const brands = rows.map((row) => row.brand);
    res.json({ brands });
  } catch (err) {
    console.error("GET /caffeine/brands error:", err);
    res.status(500).json({ message: "브랜드 조회 중 오류 발생" });
  }
});

/* -------------------------------------------------------
 * 2️⃣ 브랜드별 메뉴 조회
 * -----------------------------------------------------*/
router.get("/menus", async (req, res) => {
  const { brand } = req.query;

  if (!brand) {
    return res.status(400).json({ message: "brand 값이 필요합니다." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT DISTINCT menu FROM CaffeineMenu WHERE brand = ? ORDER BY menu",
      [brand]
    );

    const menus = rows.map((row) => {
      const original = row.menu;
      let label = original;

      // 이름 정리
      label = label.replace(/^(커피_|스무디_커피_|스무디_)/, "");
      label = label.replace(/^카페\s*/, "");
      label = label.replace(/\s*\((Short|Tall|Grande|Venti \(Iced\)|Venti \(Hot\)|Trenta)\)\s*$/, "");
      label = label.replace(/\(ICED\)/gi, "ICED").replace(/\(HOT\)/gi, "HOT");
      label = label.replace(/아이스/gi, "").replace(/핫/gi, "");
      label = label.replace(/\s+/g, " ").trim();

      return {
        label,
        menu_key: original,
      };
    });

    res.json({ menus });
  } catch (err) {
    console.error("GET /caffeine/menus error:", err);
    res.status(500).json({ message: "메뉴 조회 중 오류 발생" });
  }
});

/* -------------------------------------------------------
 * 3️⃣ 한 메뉴의 사이즈 목록 조회
 * -----------------------------------------------------*/
router.get("/sizes", async (req, res) => {
  const { brand, menu_key } = req.query;

  if (!brand || !menu_key)
    return res.status(400).json({ message: "brand, menu 모두 필요" });

  try {
    const [rows] = await db.execute(
      `SELECT size, caffeine_mg 
       FROM CaffeineMenu
       WHERE brand = ?
       AND menu LIKE CONCAT('%', ?, '%')`,
      [brand, menu_key]
    );

    res.json({ sizes: rows });
  } catch (err) {
    console.error("GET /caffeine/sizes error:", err);
    res.status(500).json({ message: "사이즈 조회 중 오류 발생" });
  }
});

/* -------------------------------------------------------
 * 4️⃣ 카페인 총량 계산
 * -----------------------------------------------------*/
router.post("/calc", async (req, res) => {
  const { items } = req.body;
  if (!items) return res.status(400).json({ message: "items 필요" });

  let total = 0;

  try {
    for (const item of items) {
      const { brand, menu, size, count } = item;

      const [rows] = await db.execute(
        "SELECT caffeine_mg FROM CaffeineMenu WHERE brand = ? AND menu = ? AND size = ?",
        [brand, menu, size]
      );

      if (rows.length > 0) {
        total += rows[0].caffeine_mg * count;
      }
    }

    res.json({ totalCaffeineMg: total });
  } catch (err) {
    console.error("POST /caffeine/calc error:", err);
    res.status(500).json({ message: "카페인 계산 중 오류 발생" });
  }
});

/* -------------------------------------------------------
 * 5️⃣ 카페인 마신 기록 저장
 * -----------------------------------------------------*/
router.post("/log", async (req, res) => {
  const { userid, drink, size, caffeine, intakeTime } = req.body;

  if (!userid || !drink || !size || !caffeine || !intakeTime) {
    return res.status(400).json({ message: "필수 값 누락" });
  }

  try {
    const caffeineId = uuidv4();

    await db.execute(
      `INSERT INTO CaffeineLog 
       (Caffeine_ID, userid, DrinkType, DrinkSize, Caffeine_Amount, IntakeTime)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [caffeineId, userid, drink, size, caffeine, intakeTime]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("POST /caffeine/log error:", err);
    res.status(500).json({ message: "카페인 기록 저장 오류" });
  }
});

/* -------------------------------------------------------
 * 6️⃣ 기존 전체 기록 조회
 * -----------------------------------------------------*/
router.get("/list/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    const [rows] = await db.execute(
      `
      SELECT Caffeine_ID, userid, DrinkType, DrinkSize, 
             Caffeine_Amount, IntakeTime, created_at
      FROM CaffeineLog
      WHERE userid = ?
      ORDER BY created_at DESC
      `,
      [userid]
    );

    res.json(rows);
  } catch (err) {
    console.error("GET /caffeine/list error:", err);
    res.status(500).json({ message: "카페인 조회 오류" });
  }
});

/* -------------------------------------------------------
 * ⭐ 7️⃣ 마이페이지용 — 날짜별 총 카페인 섭취량
 *     created_at 날짜 기준으로 변경 (정확한 날짜 비교)
 * -----------------------------------------------------*/
router.get("/simple/:userid/:date", async (req, res) => {
  const { userid, date } = req.params;

  try {
    const [rows] = await db.execute(
      `
      SELECT Caffeine_Amount
      FROM CaffeineLog
      WHERE userid = ?
        AND DATE(created_at) = ?
      `,
      [userid, date]
    );

    if (rows.length === 0) {
      return res.json({ caffeine: "기록 없음" });
    }

    const total = rows.reduce(
      (sum, r) => sum + Number(r.Caffeine_Amount),
      0
    );

    res.json({ caffeine: `${total}mg` });
  } catch (err) {
    console.error("GET /caffeine/simple error:", err);
    res.status(500).json({ message: "카페인 날짜조회 오류" });
  }
});

module.exports = router;
