const express = require("express");
const router = express.Router();
const words = require("../words.js");

const _ = require("lodash");

router.get("/", (req, res, next) => {
  const wordCode = Math.floor(Math.random() * 5757);
  console.log(`the word is: ${words[wordCode]}`);
  res.send({ wordCode });
});

router.post("/compare", (req, res, next) => {
  const { wordCode, guess } = req.body;
  const secretWord = words[wordCode];
  console.log("word: ", secretWord);
  console.log("guess: ", guess);
  if (words.includes(guess)) {
    res.send({
      valid: true,
      word: words[wordCode],
      colors: compareGuess(secretWord, guess),
    });
  }
  res.send({ valid: false });
});

const compareGuess = (secretWord, guess) =>
  guess.split("").map((letter, idx) => {
    if (secretWord.indexOf(letter) === idx) return "green";
    if (
      secretWord.indexOf(letter) >= 0 &&
      guess[secretWord.indexOf(letter)] !== letter
    )
      return "yellow";
    return "grey";
  });

module.exports = router;
