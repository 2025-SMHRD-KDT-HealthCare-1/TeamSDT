const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  console.log("📦 JSON 테스트:", req.body);
  res.json({ body: req.body });
});

module.exports = router;
