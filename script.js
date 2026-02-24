const SIZE = 8;
const EMPTY = 0;
const BLACK = 1;
const WHITE = -1;

const DIR = [
  [1,0],[-1,0],[0,1],[0,-1],
  [1,1],[1,-1],[-1,1],[-1,-1]
];

let board = [];
let current = BLACK;
let gameOver = false;

/* DOM */
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const end = document.getElementById("end");

const boardEl = document.getElementById("board");

const turnText = document.getElementById("turnText");
const blackScore = document.getElementById("blackScore");
const whiteScore = document.getElementById("whiteScore");

const winnerText = document.getElementById("winnerText");
const finalScore = document.getElementById("finalScore");

/* Buttons */
startBtn.onclick = startGame;
restartBtn.onclick = startGame;
backBtn.onclick = ()=>show(menu);
newGameBtn.onclick = ()=>show(menu);

/* How To Play */
howToPlayBtn.onclick = ()=>{
  howToPlayModal.classList.add("show");
};

closeHowToPlay.onclick = ()=>{
  howToPlayModal.classList.remove("show");
};

/* Theme */
const themeBtn = document.getElementById("themeToggle");

if(localStorage.theme==="light"){
  document.body.className="light";
  themeBtn.textContent="🌞 Light Mode";
}

themeBtn.onclick=()=>{

  if(document.body.classList.contains("light")){
    document.body.className="dark";
    themeBtn.textContent="🌙 Dark Mode";
    localStorage.theme="dark";
  }else{
    document.body.className="light";
    themeBtn.textContent="🌞 Light Mode";
    localStorage.theme="light";
  }
};

/* Screens */
function show(s){
  [menu,game,end].forEach(x=>x.classList.remove("active"));
  s.classList.add("active");
}

/* Init */
function startGame(){

  initBoard();
  current = BLACK;
  gameOver=false;

  draw();
  update();

  show(game);
}

function initBoard(){

  board = Array.from({length:8},
    ()=>Array(8).fill(0));

  board[3][3]=WHITE;
  board[3][4]=BLACK;
  board[4][3]=BLACK;
  board[4][4]=WHITE;
}

/* Logic */
function inBounds(r,c){
  return r>=0&&r<8&&c>=0&&c<8;
}

function valid(r,c,p){

  if(board[r][c]!==0) return false;

  for(let [dx,dy] of DIR){

    let x=r+dx,y=c+dy;
    let found=false;

    while(inBounds(x,y)&&board[x][y]===-p){
      found=true;
      x+=dx;y+=dy;
    }

    if(found&&inBounds(x,y)&&board[x][y]===p)
      return true;
  }

  return false;
}

function moves(p){

  let m=[];

  for(let r=0;r<8;r++)
    for(let c=0;c<8;c++)
      if(valid(r,c,p)) m.push([r,c]);

  return m;
}

function place(r,c,p){

  board[r][c]=p;

  for(let [dx,dy] of DIR){

    let x=r+dx,y=c+dy;
    let line=[];

    while(inBounds(x,y)&&board[x][y]===-p){
      line.push([x,y]);
      x+=dx;y+=dy;
    }

    if(line.length&&inBounds(x,y)&&board[x][y]===p){
      for(let [a,b] of line)
        board[a][b]=p;
    }
  }
}

function switchTurn(){

  current*=-1;

  if(!moves(current).length){
    current*=-1;

    if(!moves(current).length){
      endGame();
      return;
    }
  }

  update();
}

/* Render */
function draw(){

  boardEl.innerHTML=\"\";

  const v=moves(current);

  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){

      const cell=document.createElement(\"div\");
      cell.className=\"cell\";

      if(v.some(m=>m[0]==r&&m[1]==c))
        cell.classList.add(\"valid\");

      if(board[r][c]){

        const d=document.createElement(\"div\");
        d.className=\"disc \"+(board[r][c]==1?\"black\":\"white\");
        cell.appendChild(d);
      }

      cell.onclick=()=>play(r,c);

      boardEl.appendChild(cell);
    }
  }
}

function play(r,c){

  if(gameOver) return;
  if(!valid(r,c,current)) return;

  place(r,c,current);

  draw();
  update();
  switchTurn();
}

function update(){

  let b=0,w=0;

  board.flat().forEach(v=>{
    if(v==1)b++;
    if(v==-1)w++;
  });

  blackScore.textContent=b;
  whiteScore.textContent=w;

  turnText.textContent =
    current==1?\"Black ⚫\":\"White ⚪\";

  draw();
}

/* End */
function endGame(){

  gameOver=true;

  let b=0,w=0;

  board.flat().forEach(v=>{
    if(v==1)b++;
    if(v==-1)w++;
  });

  if(b>w) winnerText.textContent=\"Black Wins!\";
  else if(w>b) winnerText.textContent=\"White Wins!\";
  else winnerText.textContent=\"Draw!\";

  finalScore.textContent=`Black: ${b} | White: ${w}`;

  show(end);
}
