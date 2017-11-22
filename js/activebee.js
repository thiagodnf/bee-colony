var CLEAR = 0;
var GO_LEFT  = 1;
var GO_UP	 = 2;
var GO_RIGHT = 3;
var GO_DOWN  = 4;
var DO_NOTHING = 5;
var static_id = 0;
var DISPLACEMENT = 2;
var SPEED = 2;

/**
 * Classe que representa a abelha
 * @param context Contexto do canvas utilizado para pintura
 * @param x Posicao X da abelha na tela
 * @param y Posicao Y da abalha na tela
 */
function ActiveBee(env,x, y) {
	this.id = ++static_id;
	this.x = x;
	this.y = y;
	this.x0 = x;
	this.y0 = y;
	this.context = env.context;
	this.env = env;
	this.next_x = x;
	this.next_y = y;
	this.found_honey = false;
	this.honey_x = 0;
	this.honey_y = 0;
			
	this.draw = function(){		
		this.context.beginPath();
		
		if(this.found_honey)
			this.context.fillStyle = "rgb(255,0,0)";
		else
			this.context.fillStyle = "rgb(0,255,255)";
		
		this.context.arc(this.x,this.y, 3, 0, Math.PI*2, true); 
		this.context.closePath();
		this.context.fill();
	};
	
	this.defineNextPosition = function(){
		var x_max = this.env.width;
		var y_max = this.env.height;
				
		this.next_x = Math.floor(Math.random() * (x_max+ 1));
		this.next_y = Math.floor(Math.random() * (y_max+ 1));
	};
	
	this.foundInitialPosition = function(){
		var diff_x = Math.abs(this.x0 - this.x);
		var diff_y = Math.abs(this.y0 - this.y);
		
		if(diff_x <= 2 && diff_y <= 2)
			return true;
		return false;
	};
	
	this.foundNextPosition = function(){
		if(this.next_x == null || this.next_y == null)
			return false;
		
		var diff_x = Math.abs(this.next_x - this.x);
		var diff_y = Math.abs(this.next_y - this.y);
		
		if(diff_x <= 2 && diff_y <= 2)
			return true;
		return false;
	};
	
	this.foundFood = function(){
		var x = this.env.food.x;
		var x_max = x+this.env.food.width;
		var y = this.env.food.y;
		var y_max = y+this.env.food.height;
		
		if(this.x >= x && this.y >= y){
			if(this.x <= x_max && this.y <= y_max)
				return true;
		}
		return false;
	};
	
	this.goBackColony = function(){
		this.next_x = this.x0;
		this.next_y = this.y0;
	};
	
	this.step = function(){
//		if(this.foundInitialPosition()){
//			this.found_honey = false;
//			this.defineNextPosition();
//		}
		
		if(!this.foundNextPosition()){
			this.move();
		}else{
			this.goBackColony();
		}
//		
//		if(this.foundFood()){
//			this.found_honey = true;
//			this.goBackColony();
//		}	
	};	
	
	this.move = function(){
		//Define se nessa geracao ela vai seguir para o objetivo
		//ou vai para alguma posicao aleatoria
		var go = (Math.random() > 0.6)?true:false;
		
		if(go){
			if(this.x > this.next_x)
				this.x -= SPEED;
			else
				this.x += SPEED;
			
			if(this.y > this.next_y)
				this.y -= SPEED;
			else
				this.y += SPEED;
		}else{
			var left = Math.random();
			if(left <= 0.5)
				this.x -= SPEED;
			else
				this.x += SPEED;
		
			var up = Math.random();
			if(up <= 0.5)
				this.y += SPEED;
			else
				this.y -= SPEED;
		}
	};
}