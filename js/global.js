"use strict";

window.addEventListener("contextmenu", (ev) => {
  ev.preventDefault();
  return false;
});
var gDificulty = 0;
var gMinesCount = 0;

const X = "X";
const MINE = "💣";
const MARK = "🚩";
const MAX_STRIKES = 3;
const LIFE_LOST = "💔";
const LIFE = "🧡";
const RESTART_SMILEY = "🙃";
const DEAD_SMILEY = "💀";
const WINNER_SMILEY = "😎";

var gBoard;
var gGame;
var timerIntervalIdx = 0;
