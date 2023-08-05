"use strict";

function createCell(i, j) {
  var cell = {
    type: X,
    i,
    j,
    isShown: false,
    isMarked: false,
  };
  return cell;
}

function createBoard() {
  const board = [];
  for (var i = 0; i < gDificulty; i++) {
    board[i] = [];
    for (var j = 0; j < gDificulty; j++) {
      board[i][j] = createCell(i, j);
    }
  }
  var mines = arrayOfRandomCells();
  for (var i = 0; i < gMinesCount; i++)
    board[mines[i].row][mines[i].col].type = MINE;
  return board;
}

function getRandomCell() {
  var row = getRandomInt(0, gDificulty);
  var col = getRandomInt(0, gDificulty);
  return { row, col };
}
function arrayOfRandomCells() {
  var randomCells = [];
  for (var i = 0; i < gMinesCount; i++) {
    var currCell = getRandomCell();
    if (
      randomCells.some(
        (cell) => cell.row === currCell.row && cell.col === currCell.col
      )
    ) {
      i--;
    } else {
      randomCells.push(currCell);
    }
  }
  return randomCells;
}

function renderTable(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board.length; j++) {
      var className = `row-${i} col-${j} type-${board[i][j].type}`;
      if (board[i][j].isMarked) {
        className += "marked";
      }
      if (board[i][j].isShown) {
        className += "shown";
      }
      strHTML += `<td class="${className}" onclick="onCellClick(this,${i},${j})" oncontextmenu="onMark(this,${i},${j})"></td>`;
    }
    strHTML += "</tr>";
  }
  var table = document.querySelector(".table tbody");
  table.innerHTML = strHTML;
}

function renderCell(location, type) {
  var elCell = document.querySelector(`.row-${location.i}.col-${location.j}`);
  elCell.innerText = type;
}

function showAllMine() {
  var count = 0;
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[i].length; j++) {
      if (gBoard[i][j].type === MINE) {
        count++;
        document.querySelector(`.row-${i}.col-${j}`).classList.add("shown");
        renderCell({ i, j }, MINE);
      }
    }
  }
}

function countMineNeighbor(rowIdx, colIdx) {
  var mineCount = 0;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= gBoard[0].length) continue;
      var currCell = gBoard[i][j];
      if (currCell.type === MINE) {
        mineCount++;
      }
    }
  }
  return mineCount;
}

function isEmpty(rowIdx, colIdx) {
  if (gGame.isOnHint) return;
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (i === rowIdx && j === colIdx) continue;
      if (j < 0 || j >= gBoard[0].length) continue;
      var currCell = gBoard[i][j];
      if (currCell.type === X && !currCell.isMarked && !currCell.isShown) {
        currCell.isShown = true;
        const mineNeighbors = countMineNeighbor(i, j);
        document.querySelector(`.row-${i}.col-${j}`).classList.add("shown");
        gGame.shownCount++;
        renderCell({ i, j }, mineNeighbors > 0 ? mineNeighbors : X);
        if (mineNeighbors === 0) {
          isEmpty(i, j);
        }
      }
    }
  }
}

function isVictory() {
  var emptyCellsNumber = gDificulty * gDificulty - gMinesCount;
  if (gGame.strikes < MAX_STRIKES) {
    return (
      emptyCellsNumber === gGame.shownCount ||
      gGame.strikes === gGame.minesToDeflect
    );
  }
}

function gameWon() {
  document.querySelector(".smiley").innerText = WINNER_SMILEY;
  gGame.isOn = false;
  stopTimer();
  document.querySelector(".game-over").style.display = "block";
  document.querySelector(".game-over h4").innerText = WIN_MSG;
}

function gameOver() {
  document.querySelector(".smiley").innerText = DEAD_SMILEY;
  gGame.isOn = false;
  stopTimer();
  document.querySelector(".game-over").style.display = "block";
  document.querySelector(".game-over h4").innerText = DEAD_MSG;
}

function startTimer() {
  timerIntervalIdx = setInterval(() => {
    gGame.secsPassed += 50;
    updateTimerDisplay();
  }, 50);
}
function updateTimerDisplay() {
  document.querySelector(".timer").innerText = new Date(gGame.secsPassed)
    .toISOString()
    .slice(14, 23);
}
function stopTimer() {
  if (timerIntervalIdx) {
    clearInterval(timerIntervalIdx);
    timerIntervalIdx = null;
  }
}

function resetHearts() {
  for (var i = 0; i < 3; i++)
    document.querySelector(`.life${i + 1}`).innerText = LIFE;
}

function showAllNeighbors(rowIdx, colIdx) {
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      if (j < 0 || j >= gBoard[0].length) continue;
      if (gGame.isOnHint) {
        if (!gBoard[i][j].isShown) {
          renderCell({ i, j }, `${gBoard[i][j].type}`);
          document.querySelector(`.row-${i}.col-${j}`).classList.add("shown");
        }
      } else {
        if (!gBoard[i][j].isShown) {
          renderCell({ i, j }, EMPTY);
          document
            .querySelector(`.row-${i}.col-${j}`)
            .classList.remove("shown");
          document
            .querySelector(`.row-${i}.col-${j}`)
            .classList.add("unopened");
        }
      }
    }
  }
}
