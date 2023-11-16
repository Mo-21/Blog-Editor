if (process.env.NODE_ENV !== "production") {
  const dotenv = require("dotenv").config();
}
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const multer = require("multer");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const apiRouter = require("./routes/api");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.DATABASE_URL);
  console.log("Mongoose Connected...");
}

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "/images")));

app.use(express.static("dist"));
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", apiRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
