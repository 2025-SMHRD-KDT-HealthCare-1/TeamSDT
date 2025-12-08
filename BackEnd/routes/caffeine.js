const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { v4: uuidv4 } = require("uuid");

function convertStarbucksSize(volume) {
  const num = parseInt(volume.replace(/[^0-9]/g, ""));

  if (num === 237) return "Short";
  if (num === 355) return "Tall";
  if (num === 473) return "Grande";
  if (num === 591) return "Venti (Iced)";
  if (num === 710) return "Trenta";
  if (num === 946) return "Venti (Hot)";

  return volume;
}

function normalizeLabel(original) {
  let label = original;

  label = label.replace(/^(커피_|스무디_커피_|스무디_)/, "");
  label = label.replace(/^카페\s*/, "");
  label = label.replace(/\((Short|Tall|Grande|Venti \(Iced\)|Venti \(Hot\)|Trenta)\)/g, "");
  label = label.replace(/\(ICED\)/gi, "ICED").replace(/\(HOT\)/gi, "HOT");
  label = label.replace(/아이스/gi, "").replace(/핫/gi, "");
  label = label.replace(/ICEDICED/g, "ICED").replace(/HOTHOT/g, "HOT");

  return label.replace(/\s+/g, " ").trim();
}

router.get("/brands", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT DISTINCT brand FROM caffeine_menu ORDER BY brand"
    );
    const brands = rows.map((row) => row.brand);
    res.json({ brands });
  } catch (err) {
    console.error("GET /caffeine/brands error:", err);
    res.status(500).json({ message: "브랜드 조회 중 오류 발생" });
  }
});

router.get("/menus", async (req, res) => {
  const { brand } = req.query;

  if (!brand) {
    return res.status(400).json({ message: "brand 값이 필요합니다." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT DISTINCT menu FROM caffeine_menu WHERE brand = ? ORDER BY menu",
      [brand]
    );

    const menus = rows.map((row) => {
      const original = row.menu;

      let label = original;

      label = label.replace(/^(커피_|스무디_커피_|스무디_)/, "");
      label = label.replace(/^카페\s*/, "");
      label = label.replace(/\s*\((Short|Tall|Grande|Venti \(Iced\)|Venti \(Hot\)|Trenta)\)\s*$/, "");
      label = label.replace(/\(ICED\)/gi, "ICED").replace(/\(HOT\)/gi, "HOT");
      label = label.replace(/아이스/gi, "").replace(/핫/gi, "");

      if (/^모카/i.test(label)) {
        label = "카페" + label;
      }
      if (/^라떼/i.test(label)) {
        label = "카페" + label;
      }

      label = label.replace(/ICEDICED/gi, "ICED").replace(/HOTHOT/gi, "HOT");
      label = label.replace(/\s+/g, " ").trim();

      return {
        label,
        menu_key: original
      };
    });

    res.json({ menus });
  } catch (err) {
    console.error("GET /caffeine/menus error:", err);
    res.status(500).json({ message: "메뉴 조회 중 오류 발생" });
  }
});

router.get("/sizes", async (req, res) => {
  const { brand, menu_key } = req.query;

  if (!brand || !menu_key)
    return res.status(400).json({ message: "brand, menu 모두 필요" });

  try {
    const [rows] = await db.execute(
      `SELECT size, caffeine_mg 
       FROM caffeine_menu 
       WHERE brand = ?
       AND menu LIKE CONCAT('%', ?, '%')`,
      [brand, menu_key]
    );

    const result = rows.map((row) => {
      let sizeLabel = row.size;

      if (brand === "스타벅스") {
        sizeLabel = convertStarbucksSize(row.size);
      }

      return {
        size: sizeLabel,
        caffeine_mg: row.caffeine_mg
      };
    });

    res.json({ sizes: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "사이즈 조회 중 오류 발생" });
  }
});

router.post("/calc", async (req, res) => {
  const { items } = req.body;
  if (!items) return res.status(400).json({ message: "items 필요" });

  let total = 0;

  try {
    for (const item of items) {
      const { brand, menu, size, count } = item;

      let querySize = size;

      if (brand === "스타벅스") {
        const reverseMap = {
          "Short": "237g",
          "Tall": "355g",
          "Grande": "473g",
          "Venti (Iced)": "591g",
          "Trenta": "710g",
          "Venti (Hot)": "946g"
        };

        if (reverseMap[size]) {
          querySize = reverseMap[size];
        }
      }

      const [rows] = await db.execute(
        "SELECT caffeine_mg FROM caffeine_menu WHERE brand = ? AND menu = ? AND size = ?",
        [brand, menu, querySize]
      );

      if (rows.length > 0) {
        total += rows[0].caffeine_mg * count;
      }
    }

    res.json({ totalCaffeineMg: total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "카페인 계산 중 오류 발생" });
  }
});



router.post("/log", async (req, res) => {
  const { userId, drink, size, caffeine, intakeTime } = req.body;

  if (!userId || !drink || !size || !caffeine || !intakeTime) {
    return res.status(400).json({ message: "필수 값 누락" });
  }

  try {
    const caffeineId = uuidv4(); // ✅ PK 생성

    await db.execute(
      `INSERT INTO CaffeineLog 
       (Caffeine_ID, UserID, DrinkType, DrinkSize, Caffeine_Amount, IntakeTime)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [caffeineId, userId, drink, size, caffeine, intakeTime]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("POST /caffeine/log error:", err);
    res.status(500).json({ message: "카페인 기록 저장 중 오류 발생" });
  }
});


module.exports = router;
