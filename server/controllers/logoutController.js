const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_logout = asyncHandler(async (req, res, next) => {
  //Get token from cookies
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //no content
  const refreshToken = cookies.jwt;
  if (!refreshToken) return res.status(401).json("Not Authorized!");

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password").exec();
  if (!user) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.status(204);
  }

  const newUser = await User.findOneAndUpdate(
    { refreshToken: user.refreshToken },
    { refreshToken: "", accessToken: "" },
    { new: true },
  );
  res
    .clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 })
    .json(newUser);
});
