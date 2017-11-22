var static_id = 0;
var BEE_SCOUT = 1;
var BEE_ACTIVE = 2;
var BEE_INACTIVE = 3;

/**
 * Classe que representa a colmeia
 * @param context Contexto do canvas utilizado para pintura
 * @param x Posicao X da colmeia na tela
 * @param y Posicao Y da colmeia na tela
 */
function Colony(env,x,y,numberOfBees) {
	this.id = ++static_id;
	this.x = x;
	this.y = y;
	this.env = env;
	this.width = 100;
	this.height = 100;
	this.context = env.context;
	this.scoutBees = new Array();
	this.activeBees = new Array();
	this.numberOfBees = numberOfBees;
		
	this.draw = function(){		
		this.context.beginPath();
		this.context.fillStyle = "rgb(150,29,28)";
		this.context.fillRect (this.x,this.y,this.width,this.height);
		this.context.closePath();
		this.context.fill();
		
		for (var i = 0; i < this.scoutBees.length; i++)
			this.scoutBees[i].draw();
		
		for (var i = 0; i < this.activeBees.length; i++)
			this.activeBees[i].draw();
		
		
	};
	
	this.createBees = function(){
		//var active = numberOfBees*0.60;
		var scout = numberOfBees*0.40;
		var inactive = numberOfBees*0.10;
		
		for(var i=0;i<numberOfBees;i++){
			var x_max = this.x+this.width-3;
			var x_min = this.x+3;
			var y_max = this.y+this.height-3;
			var y_min = this.y+3;
			
			var x = Math.floor(Math.random() * (x_max - x_min + 1) + x_min);
			var y = Math.floor(Math.random() * (y_max - y_min + 1) + y_min);
			
			var status = null;
			if(i<inactive)
				status = BEE_INACTIVE;
			else if(i>inactive && i<scout)
				this.scoutBees.push(new ScoutBee(this.env,x,y,status));
			else
				this.activeBees.push(new ActiveBee(this.env,x,y,status));			
		}
	};
	
	this.step = function(){
		for (var i = 0; i < this.scoutBees.length; i++) {
			this.scoutBees[i].step();
			if(this.scoutBees[i].foundInitialPosition() && this.scoutBees[i].found_honey){
				for (var j = 0; j < this.activeBees.length; j++) {
					var persuation = Math.random();
					if(persuation <= 0.7){
						this.activeBees[j].next_x = this.scoutBees[i].honey_x;
						this.activeBees[j].next_y = this.scoutBees[i].honey_y;
					}
				}				
			}
		}
		for (var i = 0; i < this.activeBees.length; i++) {
			this.activeBees[i].step();
		}
	};
	
	this.createBees();	
}