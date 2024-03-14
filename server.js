const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config()
const cors = require('cors');

connectDb();



const app = express();

const port = process.env.PORT || 5000;

app.use(cors({
    origin: '*'
  }));
app.use(express.json())
app.get("/", (req, res) => {
    res.status(200).send("Hey there. You have successfully connected to the Server..!")
} )
app.use("/api/contacts", require('./routes/contactRoutes'))
app.use("/api/users", require('./routes/userRoutes'))
// app.use("/api/global", require('./routes/globalRoutes'))
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Get a look at ${port}`);
})