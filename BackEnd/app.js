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

// Test 라우터 연결
const testRoutes = require("./routes/test");
app.use("/test", testRoutes);

// MyPage 라우터 연결
const mypageRoute = require("./routes/mypage");
app.use("/mypage", mypageRoute);

// 스크린타임 라우터 연결
const screenRoutes = require("./routes/screen");
app.use("/screentime", screenRoutes);

// 결과 라우터 연결
const resultRouter = require("./routes/result");
app.use("/result", resultRouter);

// 권한 동의 라우터 연결
const permissionRouter = require("./routes/permission");
app.use("/permission", permissionRouter);

app.listen(3000, () => {
  console.log("서버 실행됨 -> http://172.20.10.5:3000");
});
