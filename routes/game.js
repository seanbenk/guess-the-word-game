const express = require("express");
const router = express.Router();

/* GET game page. */
router.get("/", (req, res, next) => {
  res.render("game.html", { title: "Random Word Guess Game" });
});

module.exports = router;
