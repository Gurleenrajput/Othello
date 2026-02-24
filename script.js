/* ======================
   GAME CONSTANTS
====================== */

const SIZE = 8;
const EMPTY = 0;
const BLACK = 1;
const WHITE = -1;

const DIRECTIONS = [
  [1,0],[-1,0],[0,1],[0,-1],
  [1,1],[1,-1],[-1,1],[-1,-1]
];

/* ======================
   STATE
====================== */

let board = [];
let currentPlayer = BLACK;
let mode = 'pvp';
let difficulty = 'easy';
let gameOver = false;

/* ======================
   DOM
====================== */

const menuScreen = document.getElementById('menu');
const gameScreen = document.getElementById('game');
const endScreen = document.getElementById('end');

const boardEl = document.getElementById('board');
const turnText = document.getElementById('turnText');
const blackScoreEl = document.getElementById('blackScore');
const whiteScoreEl = document.getElementById('whiteScore');

const winnerText = document.getElementById('winnerText');
const finalScore = document.getElementById('finalScore');

/* ======================
   UI HANDLERS
====================== */

startBtn.onclick = () => {
  mode = modeSelect.value;
  difficulty = difficultySelect.value;
  startGame();
};

restartBtn.onclick = startGame;
backBtn.onclick = () => showScreen(menuScreen);
newGameBtn.onclick = () => showScreen(menuScreen);

modeSelect.onchange = () => {
  difficultySelect.style.display =
    modeSelect.value === 'ai' ? 'block' : 'none';
};

/* ======================
   SCREEN CONTROL
====================== */

function showScreen(screen) {
  [menuScreen, gameScreen, endScreen]
    .forEach(s => s.classList.remove('active'));
  screen.classList.add('active');
}

/* ======================
   INIT
====================== */

function startGame() {

  initBoard();
  renderBoard();
  updateUI();

  gameOver = false;
  currentPlayer = BLACK;

  showScreen(gameScreen);
}

function initBoard() {
  board = Array.from({length: SIZE},
    () => Array(SIZE).fill(EMPTY));

  board[3][3] = WHITE;
  board[3][4] = BLACK;
  board[4][3] = BLACK;
  board[4][4] = WHITE;
}

/* ======================
   GAME LOGIC
====================== */

function isValidMove(r,c,player,brd=board) {

  if (brd[r][c] !== EMPTY) return false;

  for (let [dx,dy] of DIRECTIONS) {

    let x = r + dx;
    let y = c + dy;
    let foundOpponent = false;

    while (inBounds(x,y) && brd[x][y] === -player) {
      foundOpponent = true;
      x += dx;
      y += dy;
    }

    if (foundOpponent && inBounds(x,y)
      && brd[x][y] === player) {
      return true;
    }
  }

  return false;
}

function getValidMoves(player, brd=board) {
  const moves = [];

  for (let r=0;r<SIZE;r++) {
    for (let c=0;c<SIZE;c++) {
      if (isValidMove(r,c,player,brd)) {
        moves.push([r,c]);
      }
    }
  }

  return moves;
}

function makeMove(r,c,player) {

  board[r][c] = player;

  for (let [dx,dy] of DIRECTIONS) {

    let x = r + dx;
    let y = c + dy;
    let line = [];

    while (inBounds(x,y) && board[x][y] === -player) {
      line.push([x,y]);
      x += dx;
      y += dy;
    }

    if (line.length && inBounds(x,y)
      && board[x][y] === player) {

      for (let [fx,fy] of line) {
        board[fx][fy] = player;
      }
    }
  }
}

function inBounds(r,c) {
  return r>=0 && r<SIZE && c>=0 && c<SIZE;
}

function switchPlayer() {

  currentPlayer *= -1;

  if (getValidMoves(currentPlayer).length === 0) {
    currentPlayer *= -1;

    if (getValidMoves(currentPlayer).length === 0) {
      endGame();
      return;
    }
  }

  updateUI();
}

function countScore() {

  let black=0, white=0;

  board.flat().forEach(v => {
    if (v===BLACK) black++;
    if (v===WHITE) white++;
  });

  return {black,white};
}

/* ======================
   RENDERING
====================== */

function renderBoard() {

  boardEl.innerHTML = '';

  const validMoves = getValidMoves(currentPlayer);

  for (let r=0;r<SIZE;r++) {
    for (let c=0;c<SIZE;c++) {

      const cell = document.createElement('div');
      cell.className = 'cell';

      if (validMoves.some(m=>m[0]===r&&m[1]===c)) {
        cell.classList.add('valid');
      }

      const v = board[r][c];

      if (v !== EMPTY) {
        const disc = document.createElement('div');
        disc.className = 'disc ' + (v===BLACK?'black':'white');
        cell.appendChild(disc);
      }

      cell.onclick = () => playMove(r,c);

      boardEl.appendChild(cell);
    }
  }
}

function playMove(r,c) {

  if (gameOver) return;

  if (!isValidMove(r,c,currentPlayer)) return;

  makeMove(r,c,currentPlayer);

  renderBoard();
  updateUI();

  switchPlayer();
}

function updateUI() {

  const {black,white} = countScore();

  blackScoreEl.textContent = black;
  whiteScoreEl.textContent = white;

  turnText.textContent =
    currentPlayer===BLACK ? 'Black ⚫' : 'White ⚪';

  renderBoard();
}

/* ======================
   END GAME
====================== */

function endGame() {

  gameOver = true;

  const {black,white} = countScore();

  if (black > white) winnerText.textContent = 'Black Wins!';
  else if (white > black) winnerText.textContent = 'White Wins!';
  else winnerText.textContent = 'Draw!';

  finalScore.textContent =
    `Black: ${black} | White: ${white}`;

  showScreen(endScreen);
}
