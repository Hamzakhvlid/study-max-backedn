const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyTokenMiddleware");
const authenticationConstroller = require("../controller/authenticationController");

router.post("/login", authenticationConstroller.login);
router.post("/logout", authenticationConstroller.logout);
router.post("/verify-token", verifyToken, authenticationConstroller.verify);


router.post("/verifyEmail", authenticationConstroller.verifyEmail);
router.post(
  "/verificationEmailResend",
  authenticationConstroller.resendVerificationEmail
);


module.exports = router;
