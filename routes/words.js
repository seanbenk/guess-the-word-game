const express = require("express");
const router = express.Router();
const words = require("../words.js");

const _ = require("lodash");

// Sends a random word code
router.get("/", (req, res, next) => {
  const wordCode = Math.floor(Math.random() * 5757);
  return res.send({ wordCode });
});

// Sends a color array
router.get("/compare", (req, res, next) => {
  const { wordCode, guess, showWord } = req.query;
  const secretWord = words[wordCode];
  if (words.includes(guess)) {
    return res.send({
      valid: true,
      guess,
      colors: generateColorArr(secretWord, guess),
    });
  }
  return res.send({
    valid: false,
  });
});

// Sends a color array and the secret word
router.get("/dev/compare", (req, res, next) => {
  const { wordCode, guess, showWord } = req.query;
  const secretWord = words[wordCode];
  if (words.includes(guess)) {
    return res.send({
      valid: true,
      guess,
      secretWord,
      colors: generateColorArr(secretWord, guess),
    });
  }
  return res.send({
    valid: false,
  });
});

// Sends the secret word
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

// Helper functions
function generateColorArr(secretWord, guess) {
  // Set all tiles to initially be grey
  const colorArr = ["grey", "grey", "grey", "grey", "grey"];
  const guessLetterCount = {};
  const secretLetterCount = getLetterCount(secretWord);

  guess.split("").forEach((letter, idx) => {
    // Define a guess letter count if it doesn't previously exist
    if (!guessLetterCount[letter]) guessLetterCount[letter] = 0;

    // Return if guess letter is not in secret word
    if (!secretWord.includes(letter)) return;

    //Generate Greens
    if (letter === secretWord[idx]) {
      colorArr[idx] = "green";
      guessLetterCount[letter]++;
      return;
    }
    // Generate Yellows
    if (guessLetterCount[letter] < secretLetterCount[letter]) {
      colorArr[idx] = "yellow";
      guessLetterCount[letter]++;
      return;
    }
  });

  return colorArr;
}

function getLetterCount(word) {
  const count = {};
  word
    .split("")
    .forEach((letter) =>
      count[letter] ? count[letter]++ : (count[letter] = 1)
    );
  return count;
}

module.exports = router;
