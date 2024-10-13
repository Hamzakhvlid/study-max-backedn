const mongoose = require('mongoose')


const possibleRoles = ["user", "admin"];

const authenticationSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: possibleRoles,
      default: "user",
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    city: {
      type: String,
      require: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  {
    timestamps: true,
  }
);

const authenticationModel = mongoose.model(
  "authentication",
  authenticationSchema
);
module.exports = authenticationModel;
