require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET_KEY;
const User = require("../model/authenticationModel");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Not Authorized");
  }

  try {
    const decodedData = jwt.verify(token, SECRET);

    // Check if the token is expired
    if (Date.now() > decodedData.expiresAt) {
      return res.status(401).send("Token Expired");
    }

    // Attach user data to the request object
    req.userId = decodedData.userId;
    req.user = await User.findById(decodedData.userId);

    if (!req.user) {
      return res.status(404).send("User not found");
    }

    next();
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = verifyToken;
