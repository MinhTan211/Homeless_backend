const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const randomBytes = require("randombytes");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const Account = new Schema({
  email: { type: String },
  password: { type: String },
  role: { type: Number, default: 0 },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

Account.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

Account.methods.comparePassword = async function (passwords) {
  return await bcrypt.compare(passwords, this.password);
};

Account.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(23).toString("hex");

  this.resetPasswordToken = crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 5 * 60 * 1000;
  console.log(this.resetPasswordToken);
  return resetToken;
};

module.exports = mongoose.model("Account", Account);
