require("dotenv").config();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authenticationModel = require("../model/acessKeyModel");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendSuccessfullPasswordResetMail,
} = require("../mailtrap/email");
const asyncHandler = require("../utils/asyncHandler");
const SECRET = process.env.JWT_SECRET_KEY;

module.exports = {
  login: asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await authenticationModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Access" });
      }
      const passCompare = await bcryptjs.compare(password, user.password);
      if (!passCompare) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Credentials" });
      }
      generateTokenAndSetCookie(res, user._id);
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      res.status(500).send("Error in login user");
    }
  }),

  logout: asyncHandler(async (req, res) => {
    try {
      await res.clearCookie("token");

      res.status(200).send("Logout successful");
    } catch (error) {
      console.log(error);
    }
  }),

  verify: asyncHandler((req, res) => {
    res.status(200).send("Verified");
  }),






  resendVerificationEmail: asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find user by email
      const user = await authenticationModel.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the user is already verified
      if (user.isVerified === true) {
        return res.status(400).json({ message: "User is already verified" });
      }

      // Generate a new verification token
      const newVerificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

      // Update the user document with the new token and expiry time
      user.verificationToken = newVerificationToken;
      user.verificationTokenExpiresAt = verificationTokenExpiresAt;

      await user.save();

      // Resend the verification email
      await sendVerificationEmail(user.email, newVerificationToken);

      res.status(200).json({
        success: true,
        message: "Verification email has been resent",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error in resending verification email" });
    }
  }),

  verifyEmail: asyncHandler(async (req, res) => {
    const { code } = req.body;
    try {
      const user = await authenticationModel.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save();
      await sendWelcomeEmail(user.email, user.username);
      res.status(200).json({
        success: true,
        message: "Email verified successfully",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error in verifying email" });
    }
  }),


};
