const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const indexRouter = require("./routes/index");
const wordsRouter = require("./routes/words");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/word", wordsRouter);

module.exports = app;
