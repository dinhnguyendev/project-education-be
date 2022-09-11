function CheckRow(Board, row, column, r, c) {
  let countLeft = 0;
  let countRight = 0;
  let left = c - 1;
  let right = c + 1;
  while (
    left >= 0 &&
    Board[r][left] == Board[r][c] &&
    Board[r][left] != null &&
    Board[r][c] != null
  ) {
    countLeft++;
    left--;
  }
  while (
    right < column &&
    Board[r][right] == Board[r][c] &&
    Board[r][right] != null &&
    Board[r][c] != null
  ) {
    countRight++;
    right++;
  }
  if (countLeft + countRight >= 4) return true;
  else return false;
}

function CheckColumn(Board, row, column, r, c) {
  let countTop = 0;
  let countBottom = 0;
  let top = c - 1;
  let bottom = c + 1;
  while (
    top >= 0 &&
    Board[top][c] == Board[r][c] &&
    Board[top][c] != null &&
    Board[r][c] != null
  ) {
    countTop++;
    top--;
  }
  while (
    bottom < row &&
    Board[bottom][c] == Board[r][c] &&
    Board[bottom][c] != null &&
    Board[r][c] != null
  ) {
    countBottom++;
    bottom++;
  }
  if (countTop + countBottom >= 4) return true;
  else return false;
}
function CheckMaincross(Board, row, column, r, c) {
  let countTopleft = 0;
  let countBottomright = 0;
  let rowLeft = r - 1;
  let columnLeft = c - 1;
  let rowRight = r + 1;
  let columnRight = c + 1;
  while (
    rowLeft >= 0 &&
    columnLeft >= 0 &&
    Board[rowLeft][columnLeft] == Board[r][c] &&
    Board[rowLeft][columnLeft] != null &&
    Board[r][c] != null
  ) {
    countTopleft++;
    rowLeft--;
    columnLeft--;
  }
  while (
    rowRight < row &&
    columnRight < column &&
    Board[rowRight][columnRight] == Board[r][c] &&
    Board[rowRight][columnRight] != null &&
    Board[r][c] != null
  ) {
    countBottomright++;
    rowRight++;
    columnRight++;
  }
  if (countTopleft + countBottomright >= 4) return true;
  else return false;
}

function CheckCross(Board, row, column, r, c) {
  let countTopright = 0;
  let countBottomleft = 0;
  let rowLeft = r + 1;
  let columnLeft = c - 1;
  let rowRight = r - 1;
  let columnRight = c + 1;
  while (
    rowLeft < row &&
    columnLeft >= 0 &&
    Board[rowLeft][columnLeft] == Board[r][c] &&
    Board[rowLeft][columnLeft] != null &&
    Board[r][c] != null
  ) {
    countBottomleft++;
    rowLeft++;
    columnLeft--;
  }
  while (
    rowRight >= 0 &&
    columnRight < column &&
    Board[rowRight][columnRight] == Board[r][c] &&
    Board[rowRight][columnRight] != null &&
    Board[r][c] != null
  ) {
    countTopright++;
    rowRight--;
    columnRight++;
  }
  if (countBottomleft + countTopright >= 4) return true;
  else return false;
}
function Check(Board, row, column, r, c) {
  if (
    CheckRow(Board, row, column, r, c) ||
    CheckColumn(Board, row, column, r, c) ||
    CheckMaincross(Board, row, column, r, c) ||
    CheckCross(Board, row, column, r, c)
  ) {
    return true;
  }
  return false;
}
module.exports = { Check };
