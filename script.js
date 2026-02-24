const SIZE=8;
const EMPTY=0;
const BLACK=1;
const WHITE=-1;

const DIR=[
[1,0],[-1,0],[0,1],[0,-1],
[1,1],[1,-1],[-1,1],[-1,-1]
];

let board=[];
let turn=BLACK;
let gameOver=false;

/* DOM */
const menu=document.getElementById("menu");
const game=document.getElementById("game");
const end=document.getElementById("end");

const boardEl=document.getElementById("board");

const turnTxt=document.getElementById("turn");
const blackTxt=document.getElementById("black");
const whiteTxt=document.getElementById("white");

const winnerTxt=document.getElementById("winner");
const scoreTxt=document.getElementById("score");

/* Buttons */
const startBtn=document.getElementById("startBtn");
const restartBtn=document.getElementById("restart");
const backBtn=document.getElementById("back");
const newBtn=document.getElementById("new");

const howBtn=document.getElementById("howBtn");
const modal=document.getElementById("modal");
const closeBtn=document.getElementById("closeBtn");

const themeBtn=document.getElementById("themeBtn");

/* Theme */
if(localStorage.theme==="light"){
  document.body.className="light";
  themeBtn.textContent="🌞 Light";
}

themeBtn.onclick=()=>{

  if(document.body.classList.contains("light")){
    document.body.className="dark";
    themeBtn.textContent="🌙 Dark";
    localStorage.theme="dark";
  }else{
    document.body.className="light";
    themeBtn.textContent="🌞 Light";
    localStorage.theme="light";
  }
};

/* Modal */
howBtn.onclick=()=>modal.classList.add("show");
closeBtn.onclick=()=>modal.classList.remove("show");

/* Buttons */
startBtn.onclick=startGame;
restartBtn.onclick=startGame;
backBtn.onclick=()=>show(menu);
newBtn.onclick=()=>show(menu);

/* Screens */
function show(s){
  [menu,game,end].forEach(x=>x.classList.remove("active"));
  s.classList.add("active");
}

/* Init */
function startGame(){

  initBoard();
  turn=BLACK;
  gameOver=false;

  draw();
  update();

  show(game);
}

function initBoard(){

  board=Array.from({length:8},
  ()=>Array(8).fill(0));

  board[3][3]=WHITE;
  board[3][4]=BLACK;
  board[4][3]=BLACK;
  board[4][4]=WHITE;
}

/* Logic */
function inside(r,c){
  return r>=0&&r<8&&c>=0&&c<8;
}

function valid(r,c,p){

  if(board[r][c]!==0) return false;

  for(let [dx,dy] of DIR){

    let x=r+dx,y=c+dy;
    let f=false;

    while(inside(x,y)&&board[x][y]===-p){
      f=true;x+=dx;y+=dy;
    }

    if(f&&inside(x,y)&&board[x][y]===p)
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

    while(inside(x,y)&&board[x][y]===-p){
      line.push([x,y]);
      x+=dx;y+=dy;
    }

    if(line.length&&inside(x,y)&&board[x][y]===p){
      for(let [a,b] of line)
        board[a][b]=p;
    }
  }
}

function swap(){

  turn*=-1;

  if(!moves(turn).length){
    turn*=-1;

    if(!moves(turn).length){
      finish();
      return;
    }
  }

  update();
}

/* Render */
function draw(){

  boardEl.innerHTML=\"\";

  const v=moves(turn);

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
  if(!valid(r,c,turn)) return;

  place(r,c,turn);

  draw();
  update();
  swap();
}

function update(){

  let b=0,w=0;

  board.flat().forEach(v=>{
    if(v==1)b++;
    if(v==-1)w++;
  });

  blackTxt.textContent=b;
  whiteTxt.textContent=w;

  turnTxt.textContent=
    turn==1?\"Black ⚫\":\"White ⚪\";

  draw();
}

/* End */
function finish(){

  gameOver=true;

  let b=0,w=0;

  board.flat().forEach(v=>{
    if(v==1)b++;
    if(v==-1)w++;
  });

  if(b>w) winnerTxt.textContent=\"Black Wins!\";
  else if(w>b) winnerTxt.textContent=\"White Wins!\";
  else winnerTxt.textContent=\"Draw!\";

  scoreTxt.textContent=`Black: ${b} | White: ${w}`;

  show(end);
}
