require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 유저 라우터 연결
const userRouter = require("./routes/user");
app.use("/user", userRouter);

// 카페인 라우터 연결
const caffeineRouter = require("./routes/caffeine");
app.use("/caffeine", caffeineRouter);

// AI 라우터 연결
const aiRoutes = require("./routes/ai-statistics");
app.use("/ai", aiRoutes);

// AI-Result 통합
const analysisRouter = require("./routes/analysis");
app.use("/analysis", analysisRouter);

// MyPage 라우터 연결
const mypageRoute = require("./routes/mypage");
app.use("/mypage", mypageRoute);

// 스크린타임 라우터 연결
const screenRoutes = require("./routes/screen");
app.use("/screentime", screenRoutes);

// 결과 라우터 연결
const resultRouter = require("./routes/result");
app.use("/result", resultRouter);

app.listen(3000, () => {
  console.log("서버 실행됨 -> http://172.20.10.5:3000");
});
