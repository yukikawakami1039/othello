// ===== 定数・グローバル変数 =====
const boardSize = 8;
let board = [];
let currentPlayer = 'black';
const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],          [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1]
];

// ドキュメント読み込み後に実行 ※改善
document.addEventListener('DOMContentLoaded', () => {
  initBoard();
  renderBoard();
});

// ===== 盤面初期化 =====
function initBoard() {
  board = Array(boardSize).fill(null)
           .map(() => Array(boardSize).fill(null));
  board[3][3] = 'white';
  board[4][4] = 'white';
  board[3][4] = 'black';
  board[4][3] = 'black';
}

// ===== 描画 =====
function renderBoard() {
  const boardElem = document.getElementById('board');
  boardElem.innerHTML = ''; // クリア
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.y = y;
      cell.dataset.x = x;
      cell.addEventListener('click', onCellClick);
      const piece = board[y][x];
      if (piece) {
        const pieceElem = document.createElement('div');
        pieceElem.className = `piece ${piece}`;
        cell.appendChild(pieceElem);
      }
      boardElem.appendChild(cell);
    }
  }
  updateStatus();
}

// ===== クリック時処理 =====
function onCellClick(e) {
  const y = +e.currentTarget.dataset.y;
  const x = +e.currentTarget.dataset.x;
  if (!board[y][x] && canPlace(y, x, currentPlayer)) {
    placePiece(y, x, currentPlayer);
    currentPlayer = (currentPlayer === 'black' ? 'white' : 'black');

    if (!hasValidMove(currentPlayer)) {
      alert(`${currentPlayer === 'black' ? '黒' : '白'} はパスします`);
      currentPlayer = (currentPlayer === 'black' ? 'white' : 'black');
      if (!hasValidMove(currentPlayer)) {
        endGame();
        return;
      }
    }

    renderBoard();
  }
}

// ===== 着手可能判定 =====
function canPlace(y, x, player) {
  const opponent = player === 'black' ? 'white' : 'black';
  for (const [dy, dx] of directions) {
    let ny = y + dy, nx = x + dx;
    let foundOpponent = false;
    if (ny<0||ny>=boardSize||nx<0||nx>=boardSize) continue;
    if (board[ny][nx] !== opponent) continue;
    foundOpponent = true;
    while (true) {
      ny += dy; nx += dx;
      if (ny<0||ny>=boardSize||nx<0||nx>=boardSize) break;
      if (board[ny][nx] === null) break;
      if (board[ny][nx] === player && foundOpponent) return true;
      if (board[ny][nx] === opponent) foundOpponent = true;
      else break;
    }
  }
  return false;
}

// ===== 石を置く＆反転 =====
function placePiece(y, x, player) {
  board[y][x] = player;
  const opponent = player === 'black' ? 'white' : 'black';
  for (const [dy, dx] of directions) {
    let ny = y + dy, nx = x + dx;
    let cellsToFlip = [];
    while (
      ny>=0&&ny<boardSize&&nx>=0&&nx<boardSize&&
      board[ny][nx] === opponent
    ) {
      cellsToFlip.push([ny, nx]);
      ny += dy; nx += dx;
    }
    if (
      cellsToFlip.length > 0 &&
      ny>=0&&ny<boardSize&&nx>=0&&nx<boardSize&&
      board[ny][nx] === player
    ) {
      for (const [fy, fx] of cellsToFlip) {
        board[fy][fx] = player;
      }
    }
  }
}

// ===== 有効手チェック =====
function hasValidMove(player) {
  for (let y=0; y<boardSize; y++) {
    for (let x=0; x<boardSize; x++) {
      if (!board[y][x] && canPlace(y, x, player)) return true;
    }
  }
  return false;
}

// ===== ステータス更新 =====
function updateStatus() {
  let blackCount=0, whiteCount=0;
  board.flat().forEach(v => {
    if (v==='black') blackCount++;
    if (v==='white') whiteCount++;
  });
  document.getElementById('status').textContent =
    `手番：${currentPlayer==='black'?'黒':'白'}  |  黒=${blackCount}  白=${whiteCount}`;
}

// ===== 終了処理 =====
function endGame() {
  let blackCount=0, whiteCount=0;
  board.flat().forEach(v => {
    if (v==='black') blackCount++;
    if (v==='white') whiteCount++;
  });
  const winner =
    blackCount>whiteCount ? '黒の勝ち！' :
    whiteCount>blackCount ? '白の勝ち！' : '引き分け！';
  alert(`ゲーム終了！\n黒=${blackCount}  白=${whiteCount}\n${winner}`);
}
