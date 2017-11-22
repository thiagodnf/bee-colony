var mouseX = 0;
var mouseY = 0;

var context = 0;
var canvas = 0;

var env = 0;

var speed = 10;
var isPlay = false;
var isPress = false;
var showGrid = true;

function play() {
	env.step();
	if (isPlay)
		setTimeout(play, (20 - speed) * 10);
}

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

$(function() {
	canvas = document.getElementById('canvasGame');
	context = canvas.getContext('2d');
	canvas.onselectstart = function () { return false; };

	resizeCanvas();
	
	env = new Environment(context, context.canvas.height, context.canvas.width);
	env.draw();
	
	$("#sliderSpeed").slider({
		range : "min",
		value : 10,
		min : 1,
		max : 20,
		step : 2,
		slide : function(event, ui) {
			speed = ui.value;
			//env.setSpeed(ui.value);
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
	
	$("#buttonAdd").button({
		icons : {
			primary : "ui-icon-plusthick"
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

//	$("#canvasGame").mousemove(function(e) {
//		if (e.offsetX) {
//			mouseX = e.offsetX;
//			mouseY = e.offsetY;
//		} else if (e.layerX) {
//			mouseX = e.layerX;
//			mouseY = e.layerY;
//		} else if (e.clientX) { // Firefox
//			mouseX = e.clientX - $("#canvasGame").offset().left;
//			mouseY = e.clientY - $("#canvasGame").offset().top;
//		}
//
//		if (isPress) {
//			env.addWall(mouseX,mouseY);			
//		}
//	});

	$("#canvasGame").click(function(e) {
		// if(!isPlay && !isPress)
		// game.toggleStatus(mouseX, mouseY);
	});

	$("#buttonClear").click(function(e) {
		if (!isPlay) {
			env.clear();
		}
	});
	
//	$("#buttonGrid").click(function(e) {
//		
//		showGrid = ! showGrid;
//		env.showGrid = showGrid;
//		if(showGrid){
//			$("#labelButtonGrid").addClass("ui-state-active");
//			env.drawGrid();
//		}else{			
//			env.removeGrid();
//			$("#labelButtonGrid").removeClass("ui-state-active");
//		}
//		
//	});

	$("#buttonStep").click(function(e) {
		env.step();
	});
	
	$("#buttonZoom").click(function(e) {
		e.preventDefault();
		
		var pos = $(this).position();
		$("#divContainerZoom").css("left",(pos.left)+"px");
		console.log(pos.left);		
		$("#divContainerZoom").toggle();        
    });
	
	$("#buttonAdd").click(function(e) {
		e.preventDefault();
		
		var pos = $(this).position();
		$("#divContainerAdd").css("left",(pos.left)+"px");
		console.log(pos.left);		
		$("#divContainerAdd").toggle();
		
    });

	$("#buttonPlay").click(function() {
		isPlay = !isPlay;
		if (isPlay) {
			$("#buttonStep").fadeTo("fast", .4);
			$("#buttonClear").fadeTo("fast", .4);
			options = {
				label : "Pause",
				icons : {
					primary : "ui-icon-pause"
				}
			};
			$(this).button("option", options);
			play();			
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
		//$("#divContainerZoom").hide();
		$("#divContainerAdd").hide();
			
		//console.log(parent[0].id);
		if(e.target.id == "divContainerZoom" 
			|| parent[0].id == "divContainerZoom" 
				|| parent[0].id == "sliderZoom"){
			$("#divContainerZoom").show();
		}			
	});

	$("#canvasGame").mousedown(function() {
//		isPress = true;
//		env.toggleWall(mouseX, mouseY);
	});

});
