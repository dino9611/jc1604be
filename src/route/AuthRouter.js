const express = require("express");
const router = express.Router();

const { AuthController } = require("./../controllers");

const { Register, login, verifiedToken } = AuthController;

router.post("/register", Register);
router.post("/login", login);
router.post("/token", verifiedToken);

module.exports = router;
