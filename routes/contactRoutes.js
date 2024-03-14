const express = require("express");
const router = express.Router()
const { GET_ALL_CONTACTS, GET_CONTACT, CREATE_CONTACT, UPDATE_CONTACT, DELETE_CONTACT } = require("../controllers/contactsController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken)
router.route("/").get(GET_ALL_CONTACTS).post(CREATE_CONTACT)
router.route("/:id").get(GET_CONTACT).put(UPDATE_CONTACT).delete(DELETE_CONTACT)


module.exports = router