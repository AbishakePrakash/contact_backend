const express = require("express");
const { REGISTER_USER, LOGIN_USER, GET_AN_USER, GET_ALL_USERS } = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

// router.post("/register", REGISTER_USER)

// router.post("/login", LOGIN_USER)

// router.get("/", GET_ALL_USERS)

// router.get("/:id", GET_AN_USER)

module.exports = router
