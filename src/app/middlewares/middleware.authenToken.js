const jwt = require("jsonwebtoken");
const authentication = (req, res, next) => {
  const { token } = req.cookies;
  //todo console.log(authorizationHeaders);
  //? -> Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJudW1iZXJwaG9uZSI6IjA0NTE1NDg4IiwiaWF0IjoxNjUwNTE3NjEyLCJleHAiOjE2NTA1MTc2NDJ9.qxWvOy86ViKewahaNFGrBWt6yzUxPlwkraj0vN70wdA
  //? -> headers.payload.serectkey
  if (!token) {
    return next(res.status(401).json({message: "You need login!!"}));
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SERECT, (err, data) => {
    next();
  });
};

module.exports = authentication;
