var static_id = 0;

function Food(env,x,y) {
	
	this.id = ++static_id;
	this.x = x;
	this.y = y;
	this.env = env;
	this.width = 50;
	this.height = 50;
	this.context = env.context;
	this.bees = new Array();
	this.size = 1000;
		
	this.draw = function(){		
		this.context.beginPath();
		this.context.fillStyle = "rgb(50,129,28)";
		this.context.fillRect (this.x,this.y,this.width,this.height);
		this.context.closePath();
		this.context.fill();
	};		
}