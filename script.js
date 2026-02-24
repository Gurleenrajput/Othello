const menu=document.getElementById("menu");
const game=document.getElementById("game");

const startBtn=document.getElementById("startBtn");
const backBtn=document.getElementById("backBtn");

const board=document.getElementById("board");
const turnTxt=document.getElementById("turn");

const howBtn=document.getElementById("howBtn");
const modal=document.getElementById("modal");
const closeBtn=document.getElementById("closeBtn");

const themeBtn=document.getElementById("themeBtn");

/* Theme */
themeBtn.onclick=()=>{

  if(document.body.classList.contains("light")){
    document.body.className="dark";
    themeBtn.textContent="🌙 Dark";
  }else{
    document.body.className="light";
    themeBtn.textContent="🌞 Light";
  }
};

/* Modal */
howBtn.onclick=()=>modal.classList.add("show");
closeBtn.onclick=()=>modal.classList.remove("show");

/* Screens */
startBtn.onclick=()=>{
  show(game);
  init();
};

backBtn.onclick=()=>show(menu);

function show(s){
  [menu,game].forEach(x=>x.classList.remove("active"));
  s.classList.add("active");
}

/* Game */
let turn=1;
let data=[];

function init(){

  data=Array.from({length:8},
    ()=>Array(8).fill(0));

  data[3][3]=-1;
  data[3][4]=1;
  data[4][3]=1;
  data[4][4]=-1;

  draw();
}

function draw(){

  board.innerHTML=\"\";

  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){

      const cell=document.createElement(\"div\");
      cell.className=\"cell\";

      if(data[r][c]==1){
        const d=document.createElement(\"div\");
        d.className=\"black\";
        cell.appendChild(d);
      }

      if(data[r][c]==-1){
        const d=document.createElement(\"div\");
        d.className=\"white\";
        cell.appendChild(d);
      }

      cell.onclick=()=>play(r,c);

      board.appendChild(cell);
    }
  }

  turnTxt.textContent=turn==1?\"Black\":\"White\";
}

function play(r,c){

  if(data[r][c]!=0) return;

  data[r][c]=turn;
  turn*=-1;

  draw();
}
