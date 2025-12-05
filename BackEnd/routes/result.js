const express = require("express");
const router = express.Router();
const db = require("../db/database");

// 시간차 계산 (23:00 ~ 07:00 이런 케이스 처리됨)
function calcTimeDiff(sleep, wake) {
  const [sh, sm] = sleep.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);

  let start = sh * 60 + sm;
  let end = wh * 60 + wm;

  if (end < start) end += 24 * 60; // 자정 넘김 처리

  return (end - start) / 60;
}

// period 그룹핑
function groupByPeriod(data, period) {
  const map = {};

  data.forEach(({ date, sleep }) => {
    const d = new Date(date);
    let key = "";

    if (period === "day") key = `${d.getHours()}시`;
    if (period === "week") key = ["일","월","화","수","목","금","토"][d.getDay()];
    if (period === "month") key = `${Math.ceil(d.getDate() / 7)}주`;
    if (period === "all") key = `${d.getMonth() + 1}월`;

    map[key] = (map[key] || 0) + sleep;
  });

  return Object.entries(map).map(([label, sleep]) => ({
    label,
    sleep: Number(sleep.toFixed(1)),
  }));
}

// 최종 API
router.get("/sleep", async (req, res) => {
  const { period } = req.query;
  const user_id = req.query.user_id;

  if (!["day", "week", "month", "all"].includes(period)) {
    return res.status(400).json({ message: "period 오류" });
  }

  try {
    // 수면 설정
    const [settingRows] = await db.execute(
      `SELECT SleepTime, WakeTime FROM SleepSetting WHERE UserID = ?`,
      [user_id]
    );

    const sleepSetting = settingRows[0];
    if (!sleepSetting) {
      return res.status(400).json({ message: "수면 설정 없음" });
    }

    const baseSleepTime = calcTimeDiff(
      sleepSetting.SleepTime,
      sleepSetting.WakeTime
    );

    // 스크린타임 기록
    const [screenRows] = await db.execute(
      `SELECT DateValue, Total_ScreenTime FROM ScreenTimeRecord WHERE UserID = ?`,
      [user_id]
    );

    // 실제 수면시간 계산
    const rawSleepData = screenRows.map(row => {
      const nightScreen = row.Total_ScreenTime / 60; // 분 → 시간
      const realSleep = Math.max(baseSleepTime - nightScreen, 0);

      return {
        date: row.DateValue,
        sleep: Number(realSleep.toFixed(1)),
      };
    });

    const graph = groupByPeriod(rawSleepData, period);

    // AI 분석 
    const ai = {
      summary: `최근 평균 수면 ${graph.length ? graph[0].sleep : 0}시간`,
      problem: "야간 스마트폰 사용 과다",
      effect: "수면 효율 저하",
      solution: "취침 전 스마트폰 사용을 줄이세요",
    };

    res.json({ graph, ai });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "수면 분석 실패" });
  }
});

module.exports = router;
