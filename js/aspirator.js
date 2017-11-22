var CLEAR = 0;
var GO_LEFT  = 1;
var GO_UP	 = 2;
var GO_RIGHT = 3;
var GO_DOWN  = 4;
var DO_NOTHING = 5;
var static_id = 0;
var DISPLACEMENT = 2;



function Aspirator(context,env,i, j) {
	this.id = ++static_id;
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
		
		
		$(this).bind("stopAction",function(){ 
			console.log("Agent_"+this.id+": stop");
			$(obj.env).trigger("isAgentDone");				
		});
		
		$(this).bind("startAction",function(event,destiny){ 
			console.log("Agent_"+this.id+": start");
			obj.start(destiny);	
		});
	};
	
	this.draw = function(context){		
		this.context.drawImage(this.image,this.posX+1,this.posY+1);	
	};
	
	this.doNothing = function(){
		$(this).trigger("stopAction");
	};
	
	this.start = function(destiny){
		if (destiny == GO_LEFT)
			this.moveToLeft();
		if (destiny == GO_UP)
			this.moveToUp();
		if (destiny == GO_RIGHT)
			this.moveToRight();
		if (destiny == GO_DOWN)
			this.moveToDown();
		if (destiny == CLEAR || destiny == DO_NOTHING) {
			this.doNothing();
		}
	};
	
	this.stop = function(){
		$(this).trigger("stopAction");
	};
	
	this.isNear = function(x,y){
		if (y == this.i && x == this.j)
			return true;
		if (y + 1 == this.i && x == this.j)
			return true;
		if (y - 1 == this.i && x == this.j)
			return true;
		if (y == this.i && x + 1 == this.j)
			return true;
		if (y == this.i && x - 1 == this.j)
			return true;

		return false;
	};
	
	this.moveToRight = function(){
		if(this.posX == (this.j+1)*SIZE){
			this.j++;	
			this.stop();			
		}else{
			this.posX += DISPLACEMENT;
			
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
			this.stop();
		}else{
			this.posX -= DISPLACEMENT;
			
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
			this.stop();		
		}else{
			this.posY += DISPLACEMENT;
			
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
			this.stop();				
		}else{
			this.posY -= DISPLACEMENT;
			
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