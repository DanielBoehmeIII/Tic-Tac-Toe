const startButton = document.getElementById("start");
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const player1Name = document.getElementById("player1-name");
const player2Name = document.getElementById("player2-name");
const player1Score = document.getElementById("player1-score");
const player2Score = document.getElementById("player2-score");
let xScore = 0;
let oScore = 0;
const overlay = document.querySelector(".overlay");
const cells = document.querySelectorAll(".cell");
overlay.classList.add("overlay-hidden");

startButton.addEventListener("click", () => {
  const infoDisplay = document.querySelector(".info-display");
  infoDisplay.classList.toggle("hidden");

  player1Name.textContent = player1.value || "Player 1";
  player2Name.textContent = player2.value || "Player 2";
  player1Score.textContent = "Score: 0";
  player2Score.textContent = "Score: 0";

  player1Name.classList.add("highlight-player");
});

let chance = true;
let count = 1;
let array = [
  [-1, -1, -1],
  [-1, -1, -1],
  [-1, -1, -1],
];

const gameController = (() => {
  function checkWinner() {
    for (let i = 0; i < 3; i++) {
      let xCount = 0;
      let oCount = 0;

      for (let j = 0; j < 3; j++) {
        if (array[i][j] === 1) {
          xCount++;
        } else if (array[i][j] === 0) {
          oCount++;
        }
      }

      if (xCount === 3) {
        return 1;
      } else if (oCount === 3) {
        return 0;
      }
    }

    for (let j = 0; j < 3; j++) {
      let xCount = 0;
      let oCount = 0;

      for (let i = 0; i < 3; i++) {
        if (array[i][j] === 1) {
          xCount++;
        } else if (array[i][j] === 0) {
          oCount++;
        }
      }

      if (xCount === 3) {
        return 1;
      } else if (oCount === 3) {
        return 0;
      }
    }

    if (array[0][0] === 1 && array[1][1] === 1 && array[2][2] === 1) {
      return 1;
    } else if (array[0][0] === 0 && array[1][1] === 0 && array[2][2] === 0) {
      return 0;
    } else if (array[0][2] === 1 && array[1][1] === 1 && array[2][0] === 1) {
      return 1;
    } else if (array[0][2] === 0 && array[1][1] === 0 && array[2][0] === 0) {
      return 0;
    }

    return -1;
  }

  function restartGame() {
    array = [
      [-1, -1, -1],
      [-1, -1, -1],
      [-1, -1, -1],
    ];
    chance = true;
    count = 1;
    player1Name.classList.add("highlight-player");
    player2Name.classList.remove("highlight-player");
    cells.forEach((cell) => {
      cell.textContent = "";
    });

    const winner = document.getElementById("winner-box");
    winner.textContent = "";
    overlay.classList.toggle("overlay-hidden");
  }

  function displayWinner(result) {
    const winner = document.getElementById("winner-box");
    const victorySound = new Audio("./sounds/victory.mp3");
    if (result === 1) {
      winner.textContent = `${player1Name.textContent} wins!`;
      xScore++;
      player1Score.textContent = `Score: ${xScore}`;
      victorySound.play();
    } else if (result === 0) {
      winner.textContent = `${player2Name.textContent} wins!`;
      oScore++;
      player2Score.textContent = `Score: ${oScore}`;
      victorySound.play();
    } else if (result === -1) {
      winner.textContent = "Draw!";
    }
    overlay.classList.toggle("overlay-hidden");
  }

  function updateGame(e) {
    const row = e.target.id.charAt(0);
    const col = e.target.id.charAt(1);
    const moveSound = new Audio("./sounds/move.mp3");
    moveSound.play();
    if (array[row - 1][col - 1] === -1) {
      if (chance) {
        e.target.textContent = "X";
        array[row - 1][col - 1] = 1;
      } else {
        e.target.textContent = "O";
        array[row - 1][col - 1] = 0;
      }

      count++;
      chance = !chance;
      changePlayer();
    }

    if (count > 5) {
      const result = checkWinner();
      if (result === 1 || result === 0) {
        displayWinner(result);
      } else if (count === 10) {
        displayWinner(-1);
      }
    }
  }

  function changePlayer() {
    player1Name.classList.toggle("highlight-player");
    player2Name.classList.toggle("highlight-player");
  }

  return { array, updateGame, restartGame };
})();

const restart = document.getElementById("restart");
restart.addEventListener("click", () => {
  xScore = 0;
  oScore = 0;
  player1Score.textContent = `Score: ${xScore}`;
  player2Score.textContent = `Score: ${oScore}`;
  gameController.restartGame();
});

const nextRound = document.getElementById("next-round");
nextRound.addEventListener("click", () => {
  gameController.restartGame();
});

cells.forEach((cell) => {
  cell.addEventListener("click", (e) => {
    gameController.updateGame(e);
  });
});
