const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const connectDB = require("../config/dbConnection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const pool = require("../db");

const GET_ALL_USERS = async (req, res) => {
  const [rows] = await pool
    .query("SELECT * FROM users")
    .catch((err) => console.log("Error while fetching data: ", err));
  res.status(200).send(rows);
};

const GET_AN_USER = async (req, res) => {
  pool
    .query(`SELECT * FROM users WHERE id = ${req.params.id}`)
    .then((data) => res.send(data[0]))
    .catch((err) => console.log("Error while fetching data: ", err));
};

const REGISTER_USER = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.statusCode(400);
    throw new Error("All fields are mandatory");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log("hashedPassword: ", hashedPassword, "password: ", password);

  const [[emailExists]] = await pool.query(
    `SELECT COUNT(*) AS email_count FROM users WHERE email = ${JSON.stringify(
      email
    )}`
  );

  const currentdate = new Date();
  const timestamp =
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  if (emailExists.email_count > 0) {
    res.status(400).send("User already registered");
    throw new Error("User already registered");
  } else {
    console.log();

    pool
      .query(
        `INSERT INTO users (username, email, password) values (
          ${JSON.stringify(username)}, 
          ${JSON.stringify(email)}, 
          ${JSON.stringify(hashedPassword)}
        );`
      )
      .then((data) => {
        console.log("Record created Successfully!");
        res.status(200).send("Record created Successfully!");
      })
      .catch((err) => console.log("Error while fetching data: ", err));
  }
};

const LOGIN_USER = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const [[User]] = await pool.query(
    `SELECT * FROM users WHERE email = ${JSON.stringify(email)}`
  );

  console.log(User);

  if (!User) {
    res.status(400).send("User not found");
    throw new Error("User not found");
  }

  console.log("toke: ", process.env.ACCESS_TOKEN);
  console.log(await bcrypt.compare(password, User.password));

  if (User && (await bcrypt.compare(password, User.password))) {
    const accessToken = jwt.sign(
      {
        User: {
          username: User.username,
          email: User.email,
          id: User._id,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );
    res.status(200).json({
      id: User.id,
      username: User.username,
      email: User.email,
      accessToken,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Username or Password");
  }
};

const UPDATE_AN_USER = async (req, res) => {
  const { username, password } = req.body;

  var hashedPassword = null;

  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }
  console.log("body: ", username, hashedPassword);

  const [[User]] = await pool.query(
    `SELECT * FROM users WHERE id = ${req.params.id}`
  );

  console.log(User);

  if (!User) {
    res.status(404).send("User not found");
    throw new Error("User not found");
  }

  console.log("User found");

  const currentdate = new Date();
  const timestamp =
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  // Editting the same row
  // pool
  //   .query(
  //     `UPDATE Users SET
  //     username =  ${JSON.stringify(username)},
  //     updatedAt = ${JSON.stringify(timestamp)}
  //     WHERE id =  ${User.id}`
  //   )
  //   .then((data) => {
  //     console.log("User updated successfully: ", data[0].info);
  //     res.status(200).send("Record updated Successfully!");
  //   })
  //   .catch((err) => console.log("Error while updating User: ", err));

  // Adding new row

  pool
    .query("Start Transaction")
    .then(() => {
      if (username) {
        return pool.query(
          `INSERT INTO update_history (record_id, fieldname, previous_status, new_status)
          VALUES (
            ${User.id}, 
            "Username", 
            ${JSON.stringify(User.username)}, 
            ${JSON.stringify(username)}
            );`
        );
      }
      if (password) {
        return pool.query(
          `INSERT INTO update_history (record_id, fieldname, previous_status, new_status)
          VALUES (
            ${User.id}, 
            "Password", 
            ${JSON.stringify(User.password)}, 
            ${JSON.stringify(hashedPassword)}
            );`
        );
      }
    })
    .then(() => {
      if (username) {
        return pool.query(
          `UPDATE users SET 
            username = ?,
            updatedAt = CURRENT_TIMESTAMP
            WHERE id = ?`,
          [username, User.id]
        );
      }
      if (password) {
        return pool.query(
          `UPDATE users SET 
          password = ?,
          updatedAt = CURRENT_TIMESTAMP
          WHERE id = ?`,
          [hashedPassword, User.id]
        );
      }
    })
    // .then(() => {
    //   return pool.query(
    //     `INSERT INTO users (username, email, password, createdAt, updatedAt ) values (
    //       ${JSON.stringify(username ? username : User.username)},
    //       ${JSON.stringify(User.email)},
    //       ${JSON.stringify(hashedPassword ? hashedPassword : User.password)},
    //       ${JSON.stringify(timestamp)},
    //       ${JSON.stringify(timestamp)})`
    //   );
    // })
    .then(() => {
      return pool.query("Commit");
    })
    .then(() => {
      console.log(
        "Data Updated and New record has been created in Update_history"
      );
      res
        .status(200)
        .send("Data Updated and New record has been created in Update_history");
    })
    .catch((error) => {
      pool.query("Rollback");
      console.error("Error occurred:", error);
      res.status(500).send("An error occurred while updating and inserting.");
    });
};

const DELETE_AN_USER = async (req, res) => {
  const [[User]] = await pool.query(
    `SELECT * FROM users WHERE id = ${req.params.id}`
  );

  if (!User) {
    res.status(404);
    throw new Error("User not found");
  }

  console.log("User found");

  // const currentdate = new Date();
  // const timestamp =
  //   currentdate.getDate() +
  //   "/" +
  //   (currentdate.getMonth() + 1) +
  //   "/" +
  //   currentdate.getFullYear() +
  //   " " +
  //   currentdate.getHours() +
  //   ":" +
  //   currentdate.getMinutes() +
  //   ":" +
  //   currentdate.getSeconds();

  pool
    .query(`DELETE FROM Users WHERE id =  ${User.id}`)
    .then((data) => {
      console.log("User deleted successfully: ");
      res.status(200).send("User deleted Successfully!");
    })
    .catch((err) => console.log("Error while updating User: ", err));
};

module.exports = {
  GET_ALL_USERS,
  GET_AN_USER,
  REGISTER_USER,
  LOGIN_USER,
  UPDATE_AN_USER,
  DELETE_AN_USER,
};
