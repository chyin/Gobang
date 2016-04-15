var lattice = 40;
var me = true;
var over = false;

// 棋盘占位
var chessBorad = [];
for(var k=0;k<15; k++){
	chessBorad[k] = [];
	for(var kk=0;kk<15;kk++){
		chessBorad[k][kk] = 0;
	}
}

// 赢法数组
var winCount = 0;
var win = [];
for(var i=0; i<15; i++){
	win[i] = [];
	for(var j=0; j<15; j++){
		win[i][j] = [];
	}
}
for(var i=0; i<15; i++){
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			win[i][j+k][winCount] = true;
		}
		winCount++;
	}
}
for(var i=0; i<15; i++){
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			win[j+k][i][winCount] = true;
		}
		winCount++;
	}
}
for(var i=0; i<11; i++){
	for(var j=0; j<11; j++){
		for(var k=0; k<5; k++){
			win[i+k][j+k][winCount] = true;
		}
		winCount++;
	}
}
for(var i=0; i<11; i++){
	for(var j=4; j<15; j++){
		for(var k=0; k<5; k++){
			win[i+k][j-k][winCount] = true;
		}
		winCount++;
	}
}

// 赢法的统计数组
var myWin = [];
var computerWin = [];

for(var i=0;i<winCount;i++){
	myWin[i] = 0;
	computerWin[i] = 0;
}

// canvas
var chess = document.getElementById("canvas");
chess.width = 600;
chess.height = 600;
var context = chess.getContext('2d');

// 背景水印
var logo = new Image();
logo.src = "lu.png";
logo.globalAlpha = 0.1;
logo.onload = function(){
	context.drawImage(logo, 0, 0, 600, 600);     
	/*
    var radialGradient = context.createRadialGradient (canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, 450);  
    radialGradient.addColorStop(0, 'rgba(255, 255, 250, 0)');  
    radialGradient.addColorStop(0.7, 'rgba(220, 220, 220, 0.5)');  
    radialGradient.addColorStop(0.9, 'rgba(222, 222, 222, 0.8)');  
    radialGradient.addColorStop(1, 'rgba(238, 238, 238, 1)');  
    context.beginPath();  
    context.arc(canvas.width/2, canvas.height/2, 450, 0, Math.PI * 2, true);  
    context.closePath();  
    context.fillStyle = radialGradient;  
    context.fill();  
    */
	drawChess();
}

// 画棋盘
function drawChess(){
	context.strokeStyle = "#ADADAD";
	for(var i=0; i<15; i++){
		context.moveTo(0.5*lattice,(i+0.5)*lattice);
		context.lineTo(14.5*lattice,(i+0.5)*lattice);
		context.moveTo((i+0.5)*lattice,0.5*lattice);
		context.lineTo((i+0.5)*lattice,14.5*lattice);
	}

	context.stroke();
}

// 棋行一步
chess.onclick = function(e){
	if(over){
		return;
	}
	if(!me){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / lattice);
	var j = Math.floor(y / lattice);
	if(chessBorad[i][j]==0){
		oneStep(i,j,me);
		chessBorad[i][j] = 1;
		for(var k=0; k<winCount;k++){
			if(win[i][j][k]){
				myWin[k]++;
				computerWin[k] = 6;
				if(myWin[k]===5){
					window.alert("你赢了！");
					over = true;
				}
			}
		}
		if(!over){
			me = !me;
			computerAI();
		}
	}
}

// 进行一次落子
var oneStep = function(i,j,me){
	context.beginPath();
	context.arc((i+0.5)*lattice,(j+0.5)*lattice,0.4*lattice,0,2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient((i+0.5)*lattice+2,(j+0.5)*lattice-2,lattice*0.4,(i+0.5)*lattice+2,(j+0.5)*lattice-2,0);
	if(me){
		gradient.addColorStop(0,"#0a0a0a");
		gradient.addColorStop(1,"#636766");
	}
	else{
		gradient.addColorStop(0,"#c1c1c1");
		gradient.addColorStop(1,"#f9f9f9");
	}
	context.fillStyle = gradient;
	context.fill();
}

// 机器AI
var computerAI = function(){
	var myScore = [];
	var computerScore = [];
	var max = 0;
	var u=0, v=0;
	for(var i=0;i<15;i++){
		myScore[i] = [];
		computerScore[i] = [];
		for(var j=0;j<15;j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			if(chessBorad[i][j] ===0 ){
				// 计算分数
				for(var k=0; k<winCount;k++){
					if(win[i][j][k]){
						if(myWin[k] === 1){
							myScore[i][j] += 200;
						}else if(myWin[k] === 2){
							myScore[i][j] += 400;
						}else if(myWin[k] === 3){
							myScore[i][j] += 2000;
						}else if(myWin[k] === 4){
							myScore[i][j] += 10000;
						}
					}
					if(win[i][j][k]){
						if(computerWin[k] === 1){
							computerScore[i][j] += 220;
						}else if(computerWin[k] === 2){
							computerScore[i][j] += 420;
						}else if(computerWin[k] === 3){
							computerScore[i][j] += 2100;
						}else if(computerWin[k] === 4){
							computerScore[i][j] += 20000;
						}
					}
				}
				// 判断分数
				if(max < myScore[i][j]){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(max === myScore[i][j]){
					if(computerScore[i][j]>computerScore[u][v]){
						u = i;
						v = j;
					}
				}
				if(max < computerScore[i][j]){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(max === computerScore[i][j]){
					if(myScore[i][j]>myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}
	console.log(myScore);
	console.log(computerScore);
	oneStep(u,v,false);
	chessBorad[u][v] = 2;
	for(var k=0; k<winCount;k++){
		if(win[u][v][k]){
			computerWin[k]++;
			myWin[k] = 6;
			if(computerWin[k]===5){
				window.alert("电脑赢了！怎么样，电脑的水平强不强！");
				over = true;
			}
		}
	}
	if(!over){
		me = !me;
	}
}