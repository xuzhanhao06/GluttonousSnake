/*
Game 整个游戏类
@map 地图的实例
@food 食物的实例
@snake 蛇
@block 障碍物

*/

function Game(map,food,snake,block){
	this.map=map;
	this.food=food;
	this.snake=snake;
	this.block=block;
	this.flag=null;
	this.timer=null;
	this.init();
}
//定义初始化方法
Game.prototype.init = function(){
	this.renderMap();
	this.renderFood();
	this.renderSnake();
	this.bindEvent();
	this.start();
}

//渲染地图
Game.prototype.renderMap= function(){
	this.map.fill();
}

//渲染食物
Game.prototype.renderFood= function(){
	//渲染食物就是渲染食物在地图中的坐标系的背景图案
	// this.map.dom.childNodes[this.food.row].childNodes[this.food.col].style.backgroundColor="red";
	var row=this.food.row;
	var col=this.food.col;
	// this.map.dom.childNodes[row].childNodes[col].style.backgroundColor="red";
	//地图中的数组是用来简化代码的书写
	// this.map.arr[row][col].style.backgroundColor="red";
	this.map.arr[row][col].style.backgroundImage="url("+this.food.img+")";
	this.map.arr[row][col].style.backgroundSize="cover";
}


// 渲染蛇的方法
Game.prototype.renderSnake = function() {
	// 获取蛇的头部
	var head = this.snake.arr[this.snake.arr.length - 1];
	this.map.arr[head.row][head.col].style.backgroundImage = "url(" + this.snake.head_pic[this.snake.head_idx] + ")";
	// 渲染蛇就是在地图中渲染蛇的每一节身体坐标元素的背景图案
	for (var i = 1; i < this.snake.arr.length - 1; i++) {
		// 提取变量简化代码书写
		var row = this.snake.arr[i].row;
		var col = this.snake.arr[i].col;
		// this.map.arr[row][col].style.backgroundColor = "green";
		// 渲染背景图片
		this.map.arr[row][col].style.backgroundImage = "url(" + this.snake.body_pic[0] + ")";
	}

	// 获取蛇的尾部
	var tail = this.snake.arr[0];
	this.map.arr[tail.row][tail.col].style.backgroundImage = "url(" + this.snake.tail_pic[this.snake.tail_idx] + ")";
}

//游戏开始
Game.prototype.start=function(){
	this.flag=true;
	//缓存this
	var me=this;
	this.timer=setInterval(function(){

		//移动
		me.snake.move();
		//检测是否撞墙
		me.checkMap();
		//检测是否吃到食物
		me.checkFood();
		//检测是否吃到自己
		me.checkSnake();
		//检测是否撞到障碍物
		me.checkBlock();
		if(me.flag){
			//清屏
			me.map.clear();
		//渲染食物
		me.renderFood();
		//渲染蛇
		me.renderSnake();
		//渲染障碍物
		me.renderBlock();
		}
	},200
	)
	
}

//绑定事件
Game.prototype.bindEvent= function(){
	//缓存this
	var me=this;
	
	document.onkeydown=function(e){
		//获取用户按下的数字
		var code=e.keyCode;
		// console.log(code);
		if(code===37||code===38||code===39||code===40){
			//调用蛇的方法
			me.snake.change(code);
		}
	}
}

//结束游戏
Game.prototype.gameOver=function(){
	this.flag=false;
	//停止定时器
	clearInterval(this.timer);
}

//检测头部是否超过边界，撞墙
Game.prototype.checkMap=function(){
	//获取蛇的头部
	var head=this.snake.arr[this.snake.arr.length-1];
	//与地图的row，col进行绑定
	if(head.row<0||head.row>=this.map.row||head.col<0||head.col>=this.map.col){
		console.log("撞墙了");
		//游戏结束
		this.gameOver();
	}
}

//检测蛇是否吃到食物
Game.prototype.checkFood=function(){
	//获取蛇的头部
	var head=this.snake.arr[this.snake.arr.length-1];
	//获取食物
	var food=this.food;
	//判断蛇的头部是否与食物重合
	if(head.row===food.row&& head.col===food.col){
		console.log("吃到食物了");
		//调用蛇生长的方法
		this.snake.growUp();
		//重置食物
		this.resetFood();
	}
}

//重置食物
Game.prototype.resetFood = function() {
	console.log("重置食物");
	//随机生成row，col
	var row=parseInt(Math.random() * this.map.row);
	var col=parseInt(Math.random() * this.map.col);
	//检测食物的合法性
	//与蛇的每一节身体做比较
	for(var i=0;i<this.snake.arr.length;i++){
		var one=this.snake.arr[i];
		if(one.row===row && one.col===col){
			// alert("重合了 递归");
			this.resetFood();//递归
			return;
		}
	}
	//检测食物与障碍物关系
	for(var i=0;i<this.block.arr.length;i++){
		var one=this.block.arr[i];
		if(one.row===row && one.col===col){
			// alert("障碍物重合了");
			this.resetFood();//递归
			return;
		}
	}	
	this.food.reset(row,col);
}

//检测蛇是否吃到自己
Game.prototype.checkSnake=function(){
	//获取头部
	var head=this.snake.arr[this.snake.arr.length-1];
	//循环与蛇的每一节身体做比较
	for(var i=0;i<this.snake.arr.length-1;i++){
		var one =this.snake.arr[i];
		if(head.row===one.row && head.col===one.col){
			console.log("吃到自己了")
			this.gameOver();
		}
	}
}

//渲染障碍物
Game.prototype.renderBlock=function(){
	//循环渲染障碍物
	for(var i=0;i<this.block.arr.length;i++){
		var row=this.block.arr[i].row;
		var col=this.block.arr[i].col;
		this.map.arr[row][col].style.backgroundImage="url("+this.block.img+")";
		this.map.arr[row][col].style.backgroundSize="cover";
	}
}

//检测蛇与障碍物关系
Game.prototype.checkBlock=function(){
	//蛇头部
	var head=this.snake.arr[this.snake.arr.length-1];
	//循环与障碍物对比
	for(var i=0;i<this.block.arr.length;i++){
		var one =this.block.arr[i];
		if(one.row===head.row&&one.col===head.col){
			console.log("撞到障碍物了");
			this.gameOver();
		}
	}
}