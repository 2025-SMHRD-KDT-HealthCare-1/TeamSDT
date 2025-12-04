const express = require("express");
const router = express.Router();

// 더미 데이터 (나중에 DB로 교체 가능)
const RESULT_DATA = {

  // GET http://172.20.10.5:3000/result/sleep?period=day
  day: {
    graph: [
      { label: "0시", sleep: 0 },
      { label: "2시", sleep: 1 },
      { label: "4시", sleep: 2 },
      { label: "6시", sleep: 3 },
      { label: "8시", sleep: 1 },
    ],
    ai: {
      summary: "어제 총 수면 시간은 6시간입니다.",
      problem: "취침 시간이 늦었습니다.",
      effect: "수면 집중도가 감소했습니다.",
      solution: "오늘은 23시 이전 취침을 추천합니다.",
    },
  },

  // GET http://172.20.10.5:3000/result/sleep?period=week
  week: {
    graph: [
      { label: "월", sleep: 6.5 },
      { label: "화", sleep: 7.2 },
      { label: "수", sleep: 8.0 },
      { label: "목", sleep: 6.8 },
      { label: "금", sleep: 6.1 },
      { label: "토", sleep: 9.0 },
      { label: "일", sleep: 8.7 },
    ],
    ai: {
      summary: "이번 주 평균 수면은 7시간 30분입니다.",
      problem: "평일 취침 시간이 평균 30분 지연되었습니다.",
      effect: "수면 효율이 15% 감소했습니다.",
      solution: "23시 이전 취침을 권장합니다.",
    },
  },

  // GET http://172.20.10.5:3000/result/sleep?period=month
  month: {
    graph: [
      { label: "1주", sleep: 7.1 },
      { label: "2주", sleep: 6.8 },
      { label: "3주", sleep: 7.9 },
      { label: "4주", sleep: 8.0 },
    ],
    ai: {
      summary: "이번 달 평균 수면은 7시간 45분입니다.",
      problem: "야간 스마트폰 사용이 잦았습니다.",
      effect: "입면 시간이 평균 25분 지연되었습니다.",
      solution: "취침 전 스마트폰 사용을 줄이세요.",
    },
  },

  // GET http://172.20.10.5:3000/result/sleep?period=all
  all: {
    graph: [
      { label: "1월", sleep: 7.3 },
      { label: "2월", sleep: 6.9 },
      { label: "3월", sleep: 8.1 },
    ],
    ai: {
      summary: "최근 3개월 평균 수면은 7시간 25분입니다.",
      problem: "수면 패턴 편차가 큽니다.",
      effect: "회복 효율이 일정하지 않습니다.",
      solution: "취침 시간을 고정하는 것이 중요합니다.",
    },
  },
};

// 핵심 API
router.get("/sleep", (req, res) => {
  const { period } = req.query;

  if (!period || !RESULT_DATA[period]) {
    return res.status(400).json({
      message: "period 값이 올바르지 않습니다. (day | week | month | all)",
    });
  }

  return res.status(200).json(RESULT_DATA[period]);
});

module.exports = router;