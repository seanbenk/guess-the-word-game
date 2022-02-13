let guess = [];
let wordCode;
let guessCount = 0;
const baseUrl = "https://random-word-game-host.herokuapp.com/";

// Helper Functions
////////////////////////////////////////////////////////////////
const addLetter = (letter) => {
  if (guess.length < 5) guess.push(letter.toLowerCase());
  updateRow();
};

const removeLetter = () => {
  guess.pop();
  updateRow();
};

const updateRow = () => {
  const row = boardRows[0];
  const boxes = row.querySelectorAll(".tile");
  boxes.forEach((box, idx) => (box.textContent = guess[idx]));
};

const setNewWord = () => {
  fetch(`${baseUrl}word`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.wordCode) {
        wordCode = data.wordCode;
      }
    });
};

const keydown = (e) => {
  const { key } = e;
  if (alphabet.includes(key.toLowerCase())) {
    addLetter(key);
  }
  if (key === "Backspace") {
    removeLetter();
  }
  if (key === "Enter") {
    compareWord();
  }
};

const onPress = (attr) => {
  keydown({ key: attr });
};

const compareWord = () => {
  if (guess.length === 5) {
    fetch(
      `${baseUrl}word/dev/compare/?wordCode=${wordCode}&guess=${guess.join("")}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("data: ", data);
        if (data.valid) {
          updateBoard(data.colors);
        } else {
          console.log("invalid word");
          guess = [];
          updateRow();
        }
      });
  }
};

const updateBoard = (colors) => {
  const row = boardRows[0];
  const boxes = row.querySelectorAll(".tile");
  boxes.forEach((box, idx) => {
    const guessCp = [...guess];
    setTimeout(() => {
      const color = colors[idx];
      box.classList.add(color);
      document
        .querySelector(`[data-letter='${guessCp[idx]}']`)
        .classList.add(color);
    }, 500 * idx);
  });
  boardRows[0].classList.remove("available");
  boardRows = getBoardRows();
  if (win(colors)) return winAnimation(guess.join(""));
  if (boardRows.length <= 0) return loseAnimation();
  guess = [];
};

const win = (colors) => colors.filter((color) => color === "green").length >= 5;

const winAnimation = (guessedWord) => {
  setTimeout(() => {
    document.removeEventListener("keydown", keydown);
    document.querySelector(".modal").classList.remove("hidden");
    document.querySelector(
      ".modal-text"
    ).textContent = `Congratulations you got the word! The word was: ${guessedWord}`;
  }, 3000);
};

const loseAnimation = () => {
  setTimeout(() => {
    fetch(`${baseUrl}word/show?wordCode=${wordCode}`)
      .then((res) => res.json())
      .then((data) => {
        document.removeEventListener("keydown", keydown);
        document.querySelector(".modal").classList.remove("hidden");
        document.querySelector(
          ".modal-text"
        ).textContent = `Bad luck you didn't guess the word in time! The word was: ${data.secretWord}`;
      });
  }, 3000);
};

// Events
////////////////////////////////////////////////////////////////

const getBoardRows = () => document.querySelectorAll(".board-row.available");
let boardRows = getBoardRows();

document.addEventListener("keydown", keydown);

window.onload = () => {
  setNewWord();
};

document.querySelectorAll(".keyboard-letter").forEach((key) => {
  key.addEventListener("mousedown", () => onPress(key.dataset.letter));
});

document.querySelector(".enter-btn").addEventListener("mousedown", compareWord);
document
  .querySelector(".backspace-btn")
  .addEventListener("mousedown", removeLetter);

// Utilities
////////////////////////////////////////////////////////////////

const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
