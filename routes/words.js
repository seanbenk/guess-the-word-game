const express = require("express");
const router = express.Router();
const words = require("../words.js");

const _ = require("lodash");

router.get("/", (req, res, next) => {
  const wordCode = Math.floor(Math.random() * 5757);
  console.log(`the word is: ${words[wordCode]}`);
  return res.send({ wordCode });
});

router.get("/compare", (req, res, next) => {
  const { wordCode, guess, showWord } = req.query;
  const secretWord = words[wordCode];
  if (words.includes(guess)) {
    return res.send({
      valid: true,
      guess,
      colors: compareGuess(secretWord, guess),
    });
  }
  return res.send({
    valid: false,
  });
});

router.get("/dev/compare", (req, res, next) => {
  const { wordCode, guess, showWord } = req.query;
  const secretWord = words[wordCode];
  if (words.includes(guess)) {
    return res.send({
      valid: true,
      secretWord,
      guess,
      colors: compareGuess(secretWord, guess),
    });
  }
  return res.send({
    valid: false,
  });
});

router.get("/show", (req, res, next) => {
  const { wordCode } = req.query;
  const secretWord = words[wordCode];
  if (secretWord) {
    return res.send({
      valid: true,
      secretWord,
    });
  }
  return res.send({
    valid: false,
  });
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
