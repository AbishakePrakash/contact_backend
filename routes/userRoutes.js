const express = require("express");
const {
  REGISTER_USER,
  LOGIN_USER,
  CURRENT_USER_INFO,
  GET_ALL_USERS,
  GET_AN_USER,
  UPDATE_AN_USER,
  DELETE_AN_USER,
} = require("../controllers/userController");

const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

router.get("/", GET_ALL_USERS);

// router.use("/secured/", validateToken)

router.post("/register", REGISTER_USER);

router.post("/login", LOGIN_USER);

router.get("/:id", GET_AN_USER);

router.put("/:id", UPDATE_AN_USER);

router.delete("/:id", DELETE_AN_USER);

// router.get("/current", CURRENT_USER_INFO)

module.exports = router;
