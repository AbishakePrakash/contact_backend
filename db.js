const mysql = require("mysql2/promise");

const sqlUser = process.env.DB_USER;
const sqlPassword = process.env.DB_PASSWORD;
const sqlName = process.env.DB_NAME;

// console.log(sqlName, sqlPassword, sqlUser);

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Mysql@0108",
  database: "contactapp",
  connectionLimit: 10,
});

// pool
//   .query("SELECT * FROM user")
//   .then((data) => {
//     const users = data[0];
//     console.log(users);
//   })
//   .catch((err) => console.log(err));

module.exports = pool;
