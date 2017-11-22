var SIZE = 30;
var CLEAR = 0;
var GO_LEFT = 1;
var GO_UP = 2;
var GO_RIGHT = 3;
var GO_DOWN = 4;
var DO_NOTHING = 5;

var count = 0;

function Environment(context, height, width) {
	this.context = context;
	this.width = width;
	this.height = height;
	this.lines = 0;
	this.columns = 0;
	this.position = null;
	
	this.initCanvas = function() {
		var size_height = 0;
		var size_width = 0;

		while (size_height < this.height) {
			if (size_height + SIZE > this.height)
				break;
			this.lines++;
			size_height += SIZE;
		}
		while (size_width < this.width) {
			if (size_width + SIZE > this.width)
				break;
			this.columns++;
			size_width += SIZE;
		}
		// Redimensiona o canvas novamente para caber todos os quadrados
		this.context.canvas.width = (SIZE) * this.columns;
		this.context.canvas.height = (SIZE) * this.lines;
	};
		
	this.draw = function(){
		this.food.draw();
		this.colony.draw();		
	};
	
	this.step = function(){
		this.colony.step();
		this.context.clearRect(0, 0, this.width,this.height);
		this.draw();
	};
	
	this.initCanvas();
	this.colony = new Colony(this,width/2,height/2,50);
	this.food = new Food(this,200,100);
}