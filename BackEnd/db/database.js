const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "project-db-campus.smhrd.com",
    port: 3307,
    user: "campus_25KDT_HC1_p2_2",
    password: "smhrd2",
    database: "campus_25KDT_HC1_p2_2",
    connectionLimit: 10
});

module.exports = db;