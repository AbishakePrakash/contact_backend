const mysql = require("mysql");

const connectDB = () => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Mysql@0108",
      database: "contactapp",
    });

    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to MySQL database:", err);
        reject(err);
        return;
      }
      console.log("Connected to MySQL database");
      resolve(connection);
    });
  });
};

module.exports = connectDB;
