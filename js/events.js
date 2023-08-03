"use strict";

function onChooseDificulty(elbtn) {
  gDificulty = Number(elbtn.dataset.number);
  gMinesCount = Number(elbtn.dataset.mines);
  stopTimer();
  oninit();
}

function oninit() {
  gGame = {
    isOn: true,
    shownCount: 0,
    minesToDeflect: gMinesCount,
    strikes: 0,
    secsPassed: 0,
    isFirstClick: true,
  };
  document.querySelector(".game-over").style.display = "none";
  document.querySelector(".game-over h4").innerText = "";
  document.querySelector(".smiley").innerText = RESTART_SMILEY;
  document.querySelector(
    ".mine-dfl-counter"
  ).innerText = `${gGame.minesToDeflect}`;

  resetHearts();
  gBoard = createBoard();
  renderTable(gBoard);
  document.querySelector(".table").style.display = "table";
}

function onCellClick(elCell, i, j) {
  if (!gGame.isOn) return;
  var boardCell = gBoard[i][j];
  if (gGame.isFirstClick) {
    startTimer();
    if (boardCell.type === MINE) {
      boardCell.type = X;
      do {
        var newMine = getRandomCell();
        if (gBoard[newMine.row][newMine.col].type === X) {
          gBoard[newMine.row][newMine.col].type = MINE;
          console.log(gBoard);
        }
      } while (gBoard[newMine.row][newMine.col].type !== MINE);
    }
    gGame.isFirstClick = false;
  }
  if (boardCell.isShown || boardCell.isMarked) return;
  if (boardCell.type === X) {
    boardCell.isShown = true;
    elCell.classList.add("shown");
    gGame.shownCount++;
    isEmpty(i, j);
    renderCell({ i, j }, X);
  }
  if (boardCell.type === MINE) {
    renderCell({ i, j }, boardCell.type);
    gGame.strikes++;
    document.querySelector(`.life${gGame.strikes}`).innerText = LIFE_LOST;
    if (gGame.strikes === MAX_STRIKES) {
      showAllMine();
      gameOver();
    }
  }
  if (isVictory()) {
    gameWon();
  }
}

function onRestart() {
  if (gDificulty > 0) {
    oninit();
  }
}

function onMark(elCell, i, j) {
  var boardCell = gBoard[i][j];
  if (boardCell.isMarked) {
    boardCell.isMarked = false;
    elCell.classList.remove("marked");
    if (boardCell.type === MINE) {
      gGame.minesToDeflect++;
      document.querySelector(
        ".mine-dfl-counter"
      ).innerText = `${gGame.minesToDeflect}`;
      renderCell({ i, j }, X);
    }
  } else {
    boardCell.isMarked = true;
    elCell.classList.add("marked");
    if (boardCell.type === MINE) {
      gGame.minesToDeflect--;
      document.querySelector(
        ".mine-dfl-counter"
      ).innerText = `${gGame.minesToDeflect}`;
      elCell.classList.add("marked");
      if (isVictory()) {
        gameWon();
      }
    }
    renderCell({ i, j }, MARK);
  }
}
