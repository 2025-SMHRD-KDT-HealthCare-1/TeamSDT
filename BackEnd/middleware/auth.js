// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//     const authHeader = req.headers.authorization;

<<<<<<< HEAD
    if (!authHeader) {
        return res.status(401).json({ message: "토큰이 존재하지 않습니다." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
};
=======
//     // 헤더 없음
//     if (!authHeader) {
//         return res.status(401).json({ message: "토큰이 존재하지 않습니다." });
//     }

//     // "Bearer 토큰값" → 토큰만 분리
//     const token = authHeader.split(" ")[1];

//     try {
//         // 토큰 검증
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // 검증된 사용자 정보를 req.user에 저장
//         req.user = decoded;

//         next();  // 다음 라우터로 이동
//     } catch (err) {
//         return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
//     }
// };
>>>>>>> 5b03d7ef18aff4e7671ba2f9c4b90249b7b7bde3
