const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

//Route Protection Middleware
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token from header
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET);

      //Get the user from the token
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      res.status(401).json(err);
    }
  }

  if (!token) res.status(401).json("Not Authorized!");
});
