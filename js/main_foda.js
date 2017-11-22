var SIZE = 30;
var CLEAR = 0;
var GO_LEFT  = 1;
var GO_UP	 = 2;
var GO_RIGHT = 3;
var GO_DOWN  = 4;
var DO_NOTHING = 5;

function Environment(context, height, width) {
	this.context;
	this.widthScreen;
	this.heightScreen;
	this.matrix;
	this.lines;
	this.columns;
	this.showGrid = true;
	this.isPlay = false;
	this.sands;
	this.wallImage;
	this.aspirator;
	this.sandPercent = 0.1;

	this.constructor = function(context, height, width) {
		this.context = context;
		this.widthScreen = width;
		this.heightScreen = height;
		this.lines = 0;
		this.columns = 0;
		this.init();
		this.matrix = this.getMatrix(this.lines, this.columns);
		this.generateWall();
		this.generateRandSand();
		var obj = this;
		this.sands = new Image();
		this.sands.src = 'images/sand.png';
		this.wallImage = new Image();
		this.wallImage.src = 'images/wall_30.png';
		
		
		this.sands.onload = function(){obj.drawSands();};
		this.wallImage.onload = function(){obj.drawWalls();};
		
		this.aspirator = new Aspirator(context,this,1,1);
		this.aspirator.draw(context);
	};

	this.init = function() {
		var size_height = 0;
		var size_width = 0;

		while (size_height < this.heightScreen) {
			if (size_height + SIZE > this.heightScreen)
				break;
			this.lines++;
			size_height += SIZE;
		}
		while (size_width < this.widthScreen) {
			if (size_width + SIZE > this.widthScreen)
				break;
			this.columns++;
			size_width += SIZE;
		}
		// Redimensiona o canvas novamente para caber todos os quadrados
		this.context.canvas.width = (SIZE) * this.columns;
		this.context.canvas.height = (SIZE) * this.lines;
	};
	
	this.setSpeed = function(speed){
		this.aspirator.speed = 10-speed;
	};
	
	this.addWall = function(posX, posY) {
		var x = Math.floor(posX / SIZE);
		var y = Math.floor(posY / SIZE);

		if (x > this.widthScreen || y > this.heightScreen)
			return;
		
		//Condições para enviar colocar o muro em cima do agente
		if(y == this.aspirator.i && x == this.aspirator.j)
			return;		
		if(y+1 == this.aspirator.i && x == this.aspirator.j)
			return;		
		if(y-1 == this.aspirator.i && x == this.aspirator.j)
			return;
		if(y == this.aspirator.i && x+1 == this.aspirator.j)
			return;
		if(y == this.aspirator.i && x-1 == this.aspirator.j)
			return;
		
		

		this.matrix[y][x] = 2;	
		
		this.drawWall(y, x);
	};
	
	this.toggleWall = function(posX, posY) {
		var x = Math.floor(posX / SIZE);
		var y = Math.floor(posY / SIZE);

		if (x > this.widthScreen || y > this.heightScreen)
			return;
		
		//Condições para enviar colocar o muro em cima do agente
		if(y == this.aspirator.i && x == this.aspirator.j)
			return;		
		if(y+1 == this.aspirator.i && x == this.aspirator.j)
			return;		
		if(y-1 == this.aspirator.i && x == this.aspirator.j)
			return;
		if(y == this.aspirator.i && x+1 == this.aspirator.j)
			return;
		if(y == this.aspirator.i && x-1 == this.aspirator.j)
			return;

		if (this.matrix[y][x] == 0)
			this.matrix[y][x] = 2;
		else if (this.matrix[y][x] == 2)
			this.matrix[y][x] = 0;
		else
			this.matrix[y][x] = 2;
		
		this.drawWall(y, x);
	};

	this.getMatrix = function(lines, columns) {
		var matrix = new Array(lines);
		for ( var i = 0; i < lines; i++)
			matrix[i] = new Array(columns);

		for ( var y = 0; y < lines; y++)
			for ( var x = 0; x < columns; x++)
				matrix[y][x] = 0;

		return matrix;
	};
	
	this.generateWall = function(){
		for ( var i = 0; i < this.lines; i++){
			for ( var j = 0; j < this.columns; j++){
				if(i == 0 || j == 0 || j== this.columns-1 || i==this.lines-1)
				this.matrix[i][j] = 2;
			}
		}		
	};
	
	this.generateRandSand = function(){
		var quant = (this.lines*this.columns)*this.sandPercent;
		
		for(var q=0;q<quant;q++){
			var i = Math.floor((Math.random()*(this.lines-1))+0);
			var j = Math.floor((Math.random()*(this.columns-1))+0);
			while(this.matrix[i][j] == 1 || this.matrix[i][j] == 2){
				i = Math.floor((Math.random()*(this.lines-1))+0);
				j = Math.floor((Math.random()*(this.columns-1))+0);
			}
			this.matrix[i][j] = 1;
		}
	};
	
	this.drawSands = function(){
		for ( var i = 0; i < this.lines; i++){
			for ( var j = 0; j < this.columns; j++){
				if(this.matrix[i][j] == 1){
					//this.context.drawImage(this.sands,4+(30*i),8+(30*i));
					this.context.drawImage(this.sands,4+(30*j),8+(30*i));
				}
			}
		}
	};
	
	this.drawWall = function(i,j){
		if(this.matrix[i][j] == 2)
			this.context.drawImage(this.wallImage,(30*j),(30*i));
	};
	
	this.drawWalls = function(){
		for ( var i = 0; i < this.lines; i++){
			for ( var j = 0; j < this.columns; j++){
				if(this.matrix[i][j] == 2){
					this.context.drawImage(this.wallImage,(30*j),(30*i));
				}
			}
		}
	};

	this.drawCell = function(i, j) {
		if (i < 0 || i >= this.lines || j < 0 || j >= this.columns)
			return;

		this.context.beginPath();		
		if (this.matrix[i][j] == 1) {
			//this.context.fillStyle = "rgb(125,125,125)";
			var color = Math.floor(125-(16-SIZE)*12.5);
			this.context.fillStyle = "rgb("+color+","+color+","+color+")";
			this.context.fillRect(j * SIZE+2, i * SIZE+2, SIZE-3, SIZE-3);
			this.context.fill();
		} else {			
			this.context.clearRect(j * SIZE+2, i * SIZE+2, SIZE-3, SIZE-3);			
			this.context.stroke();
		}
	};
	
	this.drawGrid = function() {		
		if (this.showGrid) {
			
			this.context.strokeStyle = "rgb(71,71,71)";
			for ( var i = 1; i < this.lines; i++) {
				this.context.beginPath();
				this.context.moveTo(0,0.5+i*SIZE);
				this.context.lineTo(this.columns*SIZE,i*SIZE);
				this.context.stroke();
			}			
			for ( var j = 1; j < this.columns; j++) {
				this.context.beginPath();
				this.context.moveTo(0.5+j*SIZE,0);
				this.context.lineTo(j*SIZE,this.lines*SIZE);
				this.context.stroke();
			}
		}		
		//this.context.stroke();
	};
	
	this.isDone = function(){
		if(this.isPlay)
			this.step();
	};

	this.step = function() {
		var destiny = this.aspirator.applyRule();
		
		if(destiny == GO_LEFT)
			this.aspirator.moveToLeft();	
		if(destiny == GO_UP)
			this.aspirator.moveToUp();
		if(destiny == GO_RIGHT)
			this.aspirator.moveToRight();
		if(destiny == GO_DOWN)
			this.aspirator.moveToDown();
		if(destiny == CLEAR || destiny == DO_NOTHING){
			this.step();
		}				
	};

	this.constructor(context, height, width);
}


var CLEAR = 0;
var GO_LEFT  = 1;
var GO_UP	 = 2;
var GO_RIGHT = 3;
var GO_DOWN  = 4;
var DO_NOTHING = 5;



function Aspirator(context,env,i, j) {
	this.i;
	this.j;
	this.posX;
	this.poxY;
	this.image;
	this.context;
	this.speed = 5;
	this.env;
	
	this.construct = function(context,env,i,j){
		this.i = i;
		this.j = j;
		this.posX = 30*j;
		this.posY = 30*i;
		this.env = env;
		this.context = context;
		this.image = new Image();
		this.image.src = 'images/aspirator_28.png';
		var obj = this;
		this.image.onload = function(){obj.draw();};
		
		
		$(this).bind("isDone",function(){ obj.env.isDone();	});
	};
	
	this.draw = function(context){		
		this.context.drawImage(this.image,this.posX+1,this.posY+1);	
	};
	
	this.moveToRight = function(){
		if(this.posX == (this.j+1)*SIZE){
			this.j++;	
			$(this).trigger("isDone");			
		}else{
			this.posX += 1;
			
			//Apaga a tela de onde ele estava até metade dele 
			var dist = (this.posX+(SIZE/2)) - this.j*SIZE;			
			this.context.clearRect(this.j*SIZE+1,this.i*SIZE+1,dist,SIZE-2);
			
			//Redesenha a linha que o agente tá passando por cima
			this.context.beginPath();
			this.context.strokeStyle = "rgb(71,71,71)";
			this.context.moveTo(0.5+30+(this.j*30),this.i*30);
			this.context.lineTo(0.5+30+(this.j*30),this.i*30+30);
			this.context.stroke();			
			
			this.draw();
			var obj = this;
			setTimeout(function(){
				obj.moveToRight();
			},this.speed);						
		}
	};
	
	this.moveToLeft = function(){
		if(this.posX == (this.j-1)*SIZE){
			this.j--;	
			$(this).trigger("isDone");
		}else{
			this.posX -= 1;
			
			//Apaga a tela de onde ele estava até metade dele 
			var dist = (this.posX+(SIZE/2))-(this.j+1)*SIZE ;			
			this.context.clearRect(this.j*SIZE+30,this.i*SIZE+1,dist,SIZE-2);
			
			//Redesenha a linha que o agente tá passando por cima
			this.context.beginPath();
			this.context.strokeStyle = "rgb(71,71,71)";
			this.context.moveTo(0.5+30+((this.j-1)*30),this.i*30);
			this.context.lineTo(0.5+30+((this.j-1)*30),this.i*30+30);
			this.context.stroke();			
			
			this.draw();
			var obj = this;
			setTimeout(function(){
				obj.moveToLeft();
			},this.speed);						
		}
	};
	
	this.moveToDown = function(){
		if(this.posY == (this.i+1)*SIZE){
			this.i++;	
			$(this).trigger("isDone");		
		}else{
			this.posY += 1;
			
			//Apaga a tela de onde ele estava até metade dele 
			var dist = (this.posY+(SIZE/2)) - this.i*SIZE;			
			this.context.clearRect(this.j*SIZE+1,this.i*SIZE+1,SIZE-2,dist);
			
			//Redesenha a linha que o agente tá passando por cima
			this.context.beginPath();
			this.context.strokeStyle = "rgb(71,71,71)";
			this.context.moveTo(this.j*30,0.5+30+(this.i*30));
			this.context.lineTo(this.j*30+30,0.5+30+(this.i*30));
			this.context.stroke();			
			
			this.draw();
			var obj = this;
			setTimeout(function(){
				obj.moveToDown();
			},this.speed);						
		}
	};
	
	this.moveToUp = function(){
		if(this.posY == (this.i-1)*SIZE){
			this.i--;	
			$(this).trigger("isDone");				
		}else{
			this.posY -= 1;
			
			//Apaga a tela de onde ele estava até metade dele 
			var dist = (this.posY+(SIZE/2)) - (this.i+1)*SIZE;
			
			this.context.clearRect(this.j*SIZE+1,this.i*SIZE+30,SIZE-2,dist);			
			
			//Redesenha a linha que o agente tá passando por cima
			this.context.beginPath();
			this.context.strokeStyle = "rgb(71,71,71)";
			this.context.moveTo(this.j*30,0.5+30+((this.i-1)*30));
			this.context.lineTo(this.j*30+30,0.5+30+((this.i-1)*30));
			this.context.stroke();			
			
			this.draw();
			var obj = this;
			setTimeout(function(){
				obj.moveToUp();
			},this.speed);						
		}
	};
		
	this.applyRule = function(){
		var options = new Array;
		if(this.isDirty()){
			this.env.matrix[this.i][this.j] = 0;
			return CLEAR;
		}else{
			if(this.hasObstacleUp() && this.hasObstacleLeft() && this.hasObstacleRight() && this.hasObstacleDown()){ 
				return DO_NOTHING;				 
			}else if(this.hasObstacleUp() && this.hasObstacleLeft() && this.hasObstacleRight()){
				return GO_DOWN;				 
			}else if(this.hasObstacleUp() && this.hasObstacleDown() && this.hasObstacleRight()){
				return GO_LEFT;				 
			}else if(this.hasObstacleRight() && this.hasObstacleDown() && this.hasObstacleLeft()){
				return GO_UP;				 
			}else if(this.hasObstacleUp() && this.hasObstacleLeft() && this.hasObstacleDown()){
				return GO_RIGHT;				 
			}else if(this.hasObstacleUp() && this.hasObstacleLeft()){
				 options.push(GO_RIGHT);
				 options.push(GO_DOWN);
				return this.randomChoose(options);
			}else if(this.hasObstacleUp() && this.hasObstacleRight()){
				 options.push(GO_LEFT);
				 options.push(GO_DOWN);
				return this.randomChoose(options);
			}else if(this.hasObstacleDown() && this.hasObstacleRight()){
				 options.push(GO_LEFT);
				 options.push(GO_UP);
				return this.randomChoose(options);
			}else if(this.hasObstacleUp() && this.hasObstacleDown()){
				 options.push(GO_LEFT);
				 options.push(GO_RIGHT);
				return this.randomChoose(options);
			}else if(this.hasObstacleLeft() && this.hasObstacleRight()){
				 options.push(GO_UP);
				 options.push(GO_DOWN);
				return this.randomChoose(options);
			}else if(this.hasObstacleDown() && this.hasObstacleLeft()){
				 options.push(GO_RIGHT);
				 options.push(GO_UP);
				return this.randomChoose(options);
			}else if(this.hasObstacleUp()){
				options.push(GO_RIGHT);
				options.push(GO_LEFT);
				options.push(GO_DOWN);
				return this.randomChoose(options);
			}else if(this.hasObstacleDown()){
				options.push(GO_RIGHT);
				options.push(GO_LEFT);
				options.push(GO_UP);
				return this.randomChoose(options);
			}else if(this.hasObstacleRight()){
				options.push(GO_UP);
				options.push(GO_LEFT);
				options.push(GO_DOWN);
				return this.randomChoose(options);
			}else if(this.hasObstacleLeft()){
				options.push(GO_UP);
				options.push(GO_RIGHT);
				options.push(GO_DOWN);
				return this.randomChoose(options);
			}else{
				options.push(GO_LEFT);
				options.push(GO_UP);
				options.push(GO_RIGHT);
				options.push(GO_DOWN);
				return this.randomChoose(options);
			}
		}
	};
	
	this.isDirty = function(){
		if(this.env.matrix[this.i][this.j] == 1)
			return true;
		return false;
	};
	
	this.hasObstacleUp = function(){
		if(this.env.matrix[this.i-1][this.j] == 2)
			return true;
		return false;
	};
	
	this.hasObstacleDown = function(){
		if(this.env.matrix[this.i+1][this.j] == 2)
			return true;
		return false;
	};
	
	this.hasObstacleLeft = function(){
		if(this.env.matrix[this.i][this.j-1] == 2)
			return true;
		return false;
	};
	
	this.hasObstacleRight = function(){
		if(this.env.matrix[this.i][this.j+1] == 2)
			return true;
		return false;
	};
	
	this.randomChoose = function(array){
		var pos = Math.floor((Math.random()*(array.length))+0);
		return array[pos];		
	};
	
	this.construct(context,env,i,j);
}

var mouseX = 0;
var mouseY = 0;

var context = 0;
var canvas = 0;

var env = 0;

var speed = 7;
var isPlay = false;
var isPress = false;
var showGrid = true;

function resizeCanvas() {
	if ($(window).width() < 600)
		context.canvas.width = $("#menu").width() - 10;
	else
		context.canvas.width = $("#menu").width() - 10;
	if ($(window).height() < 400)
		context.canvas.height = 400;
	else
		context.canvas.height = $(window).height() - 135;
}

function openLink(param){
	var regex = "^#[0-9][0-9]*(,[0-9][0-9]*)*$";	
	if (param.match(regex)) {
		var values = param.replace("#","").split(",");				
		if(values.length%2 == 0){
			env.addValue(values);
		}else
			console.log("fail!");
	}
}

$(function() {
	canvas = document.getElementById('canvasGame');
	context = canvas.getContext('2d');

	resizeCanvas();
	
	env = new Environment(context, context.canvas.height, context.canvas.width);
	env.drawGrid();	
	
	//openLink(location.hash);

	$("#sliderSpeed").slider({
		range : "min",
		value : 5,
		min : 1,
		max : 10,
		step : 1,
		slide : function(event, ui) {
			env.setSpeed(ui.value);
			$("#labelSpeed").text("Speed: " + ui.value);
		}
	});
	
	$("#sliderZoom").slider({
		range : "min",
		value : 1,
		min : 1,
		max : 10,
		step : 1,
		slide : function(event, ui) {
			env.zoom(ui.value);
			$("#labelZoom").text("Zoom: " + ui.value);
		}
	});
	
	$(document).bind("contextmenu",function(e){
        return false;
	});	

	$("#labelButtonGrid").addClass("ui-state-active");
	$("#dialog:ui-dialog").dialog("destroy");

	$("#dialog-modal").dialog({
		autoOpen : false,
		height : 350,
		show : "drop",
		hide : "drop",
		width : 550,
		modal : true,
		buttons : {
			Close : function() {
				$(this).dialog("close");
			}
		}
	});

	$("#anchorOpenHelp").click(function() {
		$("#dialog-modal").dialog("open");
	});
	
	$("#dialog-share").dialog({
		autoOpen : false,
		height : 180,
		show : "drop",
		hide : "drop",
		width : 550,
		modal : true,
		buttons : {
			Close : function() {
				$(this).dialog("close");
			}
		}
	});
	
	$("#input-link-share").focus(function(){
	    this.select();	    
	});
	
	$("#buttonShare").click(function() {
		$("#input-link-share").val(location.hostname+"/gameoflife/"+game.getLink());
		$("#input-link-share").focus();
		$("#dialog-share").dialog("open");
	});
	
	$("#buttonGrid").button({
		icons : {
			primary : "ui-icon-calculator"
		}
	});
	
	$("#buttonZoom").button({
		icons : {
			primary : "ui-icon-zoomin"
		}
	});

	$("#buttonPlay").button({
		icons : {
			primary : "ui-icon-play"
		}
	});

	$("#buttonStop").button({
		icons : {
			primary : "ui-icon-stop"
		}
	});

	$("#buttonStep").button({
		icons : {
			primary : "ui-icon-seek-end"
		}
	});

	$("#buttonClear").button({
		icons : {
			primary : "ui-icon-trash"
		}
	});
	
	$("#buttonShare").button({
		icons : {
			primary : "ui-icon-link"
		}
	});

	$(window).resize(function(e) {

	});

	$("#canvasGame").mousemove(function(e) {
		if (e.offsetX) {
			mouseX = e.offsetX;
			mouseY = e.offsetY;
		} else if (e.layerX) {
			mouseX = e.layerX;
			mouseY = e.layerY;
		} else if (e.clientX) { // Firefox
			mouseX = e.clientX - $("#canvasGame").offset().left;
			mouseY = e.clientY - $("#canvasGame").offset().top;
		}

		if (isPress) {
			env.addWall(mouseX,mouseY);
			//env.liveByPosition(mouseX, mouseY);
		}
	});

	$("#canvasGame").click(function(e) {
		// if(!isPlay && !isPress)
		// game.toggleStatus(mouseX, mouseY);
	});

	$("#buttonClear").click(function(e) {
		if (!isPlay) {
			env.clear();
		}
	});
	
	$("#buttonGrid").click(function(e) {
		
		showGrid = ! showGrid;
		env.showGrid = showGrid;
		if(showGrid){
			$("#labelButtonGrid").addClass("ui-state-active");
			env.drawGrid();
		}else{			
			env.removeGrid();
			$("#labelButtonGrid").removeClass("ui-state-active");
		}
		
	});

	$("#buttonStep").click(function(e) {
		env.step();
	});
	
	$("#buttonZoom").click(function(e) {
		e.preventDefault();
		
		var pos = $(this).position();
		$("#divContainerZoom").css("left",(pos.left)+"px");
		console.log(pos.left);
		
		
		
		$("#divContainerZoom").toggle();
        
        
        
       // $(".signin").toggleClass("menu-open");
    });

	//    
	$("#buttonPlay").click(function() {
		env.isPlay = !env.isPlay;
		if (env.isPlay) {
			$("#buttonStep").fadeTo("fast", .4);
			$("#buttonClear").fadeTo("fast", .4);
			options = {
				label : "Pause",
				icons : {
					primary : "ui-icon-pause"
				}
			};
			$(this).button("option", options);
			env.step();			
		} else {
			$("#buttonStep").fadeTo("fast", 1.9);
			$("#buttonClear").fadeTo("fast", 1.9);
			options = {
				label : "Play",
				icons : {
					primary : "ui-icon-play"
				}
			};
			$(this).button("option", options);
		}
		
	});

	$(document).mouseup(function(e) {
		isPress = false;
		
		var parent = $(e.target).parent();
		
//		if($("#divContainerZoom").is(":visible") == true){
//			console.log("visible");
//		}
		$("#divContainerZoom").hide();
			
		//console.log(parent[0].id);
		if(e.target.id == "divContainerZoom" 
			|| parent[0].id == "divContainerZoom" 
				|| parent[0].id == "sliderZoom"){
			$("#divContainerZoom").show();
		}
		
		if(parent[0].id == "buttonZoom"){
			//console.log("o2");
			
//				console.log("oi");
//				$("#divContainerZoom").hide();
//			}
		}
		
		//console.log($("#divContainerZoom").is(':visible'));
	});

	$("#canvasGame").mousedown(function() {
		isPress = true;
		env.toggleWall(mouseX, mouseY);
	});

});
