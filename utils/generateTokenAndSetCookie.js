const jwt = require("jsonwebtoken");

generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // Ensures the cookie is only sent for same-site requests
    maxAge: 10 * 24 * 60 * 60 * 1000,
  });
  return token;
};

module.exports = generateTokenAndSetCookie;
