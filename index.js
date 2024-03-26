const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/dbConnection");
const userRoutes = require("./routes/userRoutes");
const db = require("./db");

connectDB();

const app = express();
const port = 3000;

function getUsersFromDatabase() {
  // Simulate an error condition (e.g., database connection failure)
  throw new Error("Unable to fetch users from the database");
}

db.query("SELECT 1")
  .then(() => {
    app.listen(port, () => {
      console.log(`Get a look at ${port}`);
    });
  })
  .catch((err) => {
    console.log("DB Connection failed. \n" + err);
  });

app.use(cors({ origin: "*" }));
app.use(express.json());
app.get("/", (req, res) => {
  res
    .status(200)
    .send("Hey there. You have successfully connected to the Server..!");
});

// app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", userRoutes);
// app.use("/api/global", require('./routes/globalRoutes'))
// app.use(errorHandler);
