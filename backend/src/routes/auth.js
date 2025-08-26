const express = require("express");
const router = express.Router();
const { register, login } = require("../controlller/authController");
const upload = require("../middleware/upload")
router.post("/register",upload.single("image"), register);
router.post("/login", login);

module.exports = router;
