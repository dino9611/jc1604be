const express = require("express");
const router = express.Router();

const { AuthController } = require("./../controllers");
const { verifyEmailToken } = require("./../helpers/verifyToken");

const {
  Register,
  login,
  verifiedToken,
  sendEmail,
  verifiedEmailwithoutToken,
  verifiedEmailwithToken,
  sendEmailVerification,
} = AuthController;

router.post("/register", Register);
router.get("/send", sendEmail);
router.post("/login", login);
router.post("/token", verifiedToken);

// tanpa pake token
router.get("/verified/:id", verifiedEmailwithoutToken);
router.get("/verifiedemail", verifyEmailToken, verifiedEmailwithToken);
router.post("/sendverified", sendEmailVerification);

module.exports = router;
