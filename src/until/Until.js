const { ROW, COL } = require("../constants/contants");
const { Check } = require("./CaroUntil");

function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}
function listArray(items) {
  return [...items];
}
function initGameCaro() {
  let data = [];
  for (let i = 0; i < ROW; i++) {
    data.push([]);
    for (let j = 0; j < COL; j++) {
      data[i][j] = null;
    }
  }
  return data;
}
function checkWin(gameBoard, row, col, x, y) {
  return Check(gameBoard, row, col, x, y);
}

module.exports = { random_item, listArray, initGameCaro, checkWin };
