const jwt = require("jsonwebtoken");

const Authentication = (user, res, statusCode) => {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SERECT, {
    expiresIn: "10h",
  });
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", accessToken, options).json({
    success: true,
    user,
    accessToken
  });
};
module.exports = Authentication;
