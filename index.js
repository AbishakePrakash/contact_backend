const express = require("express");
const mysql = require("mysql2/promise"); // Import mysql2/promise instead of mysql
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();

// API Log
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    console.log(req.method, res.statusCode, duration + "ms", fullUrl);
  });

  next();
});

// Defining SQL Connection
const connectionPromise = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connecting SQL db using promise
(async () => {
  try {
    const connection = await connectionPromise;
    console.log("Hooked up to the Server with " + connection.threadId);
  } catch (error) {
    console.error("Error connecting to MySQL database: " + error);
  }
})();

// Connection ID
app.get("/linkID", async (req, res) => {
  try {
    // Execute SELECT connection_id() query
    const connection = await connectionPromise;
    const [rows, fields] = await connection.execute(
      "SELECT connection_id() AS connectionId"
    );
    // Extract connection ID from results and send it as JSON response
    const connectionId = rows[0].connectionId;
    res.status(200).json({ connectionId });
  } catch (error) {
    console.error("Error executing query: " + error);
    res.status(500).send("Error executing query");
  }
});

// Server Status Checker
app.get("/", async (req, res) => {
  try {
    res.status(200).send("Oh mierda, aquí vamos de nuevo.");
  } catch (error) {
    console.error("Error connecting DB: " + error);
    res.status(500).send("Error connecting DB");
  }
});

// Boot Server
const port = 3000;
app.listen(port, () => {
  console.log(`Take a look at ${port}`);
});

//Routes

app.use("/api/users", userRoutes);

// app.use("/api/contacts", require("./routes/contactRoutes"));

// app.use("/api/global", require('./routes/globalRoutes'))

// app.use(errorHandler);
