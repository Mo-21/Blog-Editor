const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const User = require("../models/user");

exports.user_register = [
  body("username")
    .trim()
    .isLength({ max: 25 })
    .withMessage("Max 25 characters allowed")
    .isAlpha()
    .withMessage("Please only use English Alphabet")
    .escape(),
  body("password").trim().escape(),
  body("passwordConfirmation")
    .trim()
    .escape()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords do not match"),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      res.status(400).json("Please fill all fields");
    }

    if (!errors.isEmpty()) {
      res.status(400).json(errors.array());
    } else {
      try {
        const userExists = await User.findOne({ email }).exec();
        if (userExists) res.status(400).json("User already exists!");

        bcrypt.hash(password, 10, async (err, hashedPassword) => {
          if (err) res.status(400).json(err);
          const user = new User({
            username: username,
            password: hashedPassword,
            email: email,
          });
          await user.save();
          const refreshToken = generateRefreshToken(user._id);
          const newUser = await User.findOneAndUpdate(
            { username: user.username },
            {
              refreshToken: refreshToken,
              accessToken: generateAccessToken(user._id),
            },
            {},
          );
          if (user)
            res
              .status(201)
              .cookie("jwt", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000,
              })
              .json(newUser);
        });
      } catch (err) {
        res.status(400).json(err);
      }
    }
  }),
];

exports.user_login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).exec();
  if (user && (await bcrypt.compare(password, user.password))) {
    const newUser = await User.findOneAndUpdate(
      { username: user.username },
      {
        refreshToken: generateRefreshToken(user._id),
        accessToken: generateAccessToken(user._id),
      },
      { new: true },
    );
    res
      .status(200)
      .cookie("jwt", newUser.refreshToken, {
        // We add secure: true for https requests in production
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json(newUser);
  } else {
    res.status(400).json("Invalid Credentials");
  }
});

//Generate Access JWT Token
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: "15m",
  });
};

//Generate Refresh JWT Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: "1d",
  });
};
