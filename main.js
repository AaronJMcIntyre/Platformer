var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here
 var score = 0;
var lives = 3;

var heartImage = document.createElement("img")
heartImage.src = "smallheart.png";



var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;


var gameState = STATE_SPLASH;
var splashTimer = 3;
function runSplash(deltaTime)
{
	splashTimer -= deltaTime;
if(splashTimer <= 0)
{
gameState = STATE_GAME;
return;
}

context.fillStyle = "#000";
context.font="24px Arial";
context.fillText("SPLASH SCREEN", 200, 240);
}




function runGame(deltaTime)
{
	
	
	
	context.save();
	if (player.position.x >= viewOffset.x + canvas.width/2)
	{
		viewOffset.x = player.position.x - canvas.width/2;
	}
	context.translate(-viewOffset.x, 0);  
	  drawMap();
	  
	
	player.update(deltaTime);
	
	
	
	
	player.draw();
	
	
	
	
		// enemy update and draw
		for(var i=0; i<enemies.length; i++)
	{
		enemies[i].update(deltaTime);
	}
		
	for(var i=0; i<enemies.length; i++)
	{
		enemies[i].draw(deltaTime);
	}
	
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].draw();
	}
	// enemy update and draw.
	context.restore();
	
	
	
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 3, 10, 100);

	
	
	
	}
function runGameOver(deltaTime)
{
	context.fillStyle = "#f00";
context.font="72px Arial";
context.fillText("GAMEOVER", 100, 240);
}


var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

// load an image to draw
var chuckNorris = document.createElement("img");
chuckNorris.src = "hero.png";

var bullets = [];



var enemies = [];


var LAYER_BACKGOUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_LADDERS = 2;

var LAYER_OBJECT_ENEMIES = 3;
var LAYER_OBJECT_TRIGGERS = 4;




var LAYER_COUNT = level1.layers.length;
var MAP = {tw: level1.width, th: level1.height};
var TILE = level1.tilewidth;
var TILESET_TILE = level1.tilesets[0].tilewidth;
var TILESET_PADDING = level1.tilesets[0].margin;
var TILESET_SPACING = level1.tilesets[0].spacing;
var TILESET_COUNT_X = level1.tilesets[0].columns;
var TILESET_COUNT_Y = level1.tilesets[0].tilecount
                          / TILESET_COUNT_X;

var tileset = document.createElement("img");
tileset.src = level1.tilesets[0].image; 

 // 1meter = 1tile
var METER = TILE;

//very exagerated gravity (6x)
var GRAVITY = METER * 9.8 * 6;

// maximum horizontal speed (10 tiles  per second)
var MAXDX = METER * 10;
 
// maximum vertical speed (15 tiles per second)
var MAXDY = METER * 15;

// horizontal acceleration  - 1/2 sec to reach maxdx
var ACCEL = MAXDX * 2;

// horizontal friction  - 1/6 second to stop from maxdx
var FRICTION = MAXDX * 6;

// (a large) instantaneous jump impulse
var JUMP = METER * 1500;

var ENEMY_MAXDX = METER * 5;
var ENEMY_ACCEL = ENEMY_MAXDX * 2;

function cellAtPixelCoord(layer, x,y)
{
if(x<0 || x>SCREEN_WIDTH)
return 1;
// let the player drop of the bottom of the screen (this means death)
if(y>SCREEN_HEIGHT)
return 0;
return cellAtTileCoord(layer, p2t(x), p2t(y));
};
function cellAtTileCoord(layer, tx, ty)
{
if(tx<0 || tx>=MAP.tw)
return 1;
// let the player drop of the bottom of the screen (this means death)
if(ty>=MAP.th)
return 0;
return cells[layer][ty][tx];
};
function tileToPixel(tile)
{
return tile * TILE;
};
function pixelToTile(pixel)
{
return Math.floor(pixel/TILE);
};
function bound(value, min, max)
{
if(value < min)
return min;
if(value > max)
return max;
return value;
} 
  


var player = new Player();

var keyboard = new Keyboard();

var viewOffset = new Vector2();



function shoot (){
	var bullet = new Bullet(
	player.position.x, player.position.y, player.direction == RIGHT);
	bullets.push(bullet);

}

 function drawMap()
{
	
	
for(var layerIdx=0; 
layerIdx<LAYER_COUNT; 
layerIdx++)
{
	if(layerIdx ==  LAYER_OBJECT_ENEMIES)
		continue;
 
 var offsetx = level1.layers[layerIdx].offsetx || 0;
 var offsety = level1.layers[layerIdx].offsety ||0;
 
var idx = 0;
for( var y = 0; y < level1.layers[layerIdx].height; y++ )
{
for( var x = 0; x < level1.layers[layerIdx].width; x++ )
{
if( level1.layers[layerIdx].data[idx] != 0 )
{
// the tiles in the Tiled map are base 1 (meaning a value of 0 means no tile), so subtract one from the tileset id to get the
// correct tile
var tileIndex = level1.layers[layerIdx].data[idx] - 1;
var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) * (TILESET_TILE + TILESET_SPACING);
var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) * (TILESET_TILE + TILESET_SPACING);
context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE, x*TILE + offsetx, (y-1)*TILE + offsety, TILESET_TILE, TILESET_TILE);
}
idx++;
}
}
}
}

var cells = []; // the array that holds our simplified collision data

var musicBackground;
var sfxFire;

function initialize() {
	
	

	
// add enemies.
var idx = 0;
for(var y = 0; y < level1.layers[LAYER_OBJECT_ENEMIES].height; y++) {
	for(var x = 0; x < level1.layers[LAYER_OBJECT_ENEMIES].width; x++) {
		if(level1.layers[LAYER_OBJECT_ENEMIES].data[idx] != 0) {
			var px = tileToPixel(x);
			var py = tileToPixel(y);
			var e = new Enemy(px, py);
			enemies.push(e);
		}
		idx++;
	}
}	
	
	
	
 for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) { // initialize the collision map
 cells[layerIdx] = [];
 var idx = 0;
 for(var y = 0; y < level1.layers[layerIdx].height; y++) {
 cells[layerIdx][y] = [];
 for(var x = 0; x < level1.layers[layerIdx].width; x++) {
 if(level1.layers[layerIdx].data[idx] != 0) {
 // for each tile we find in the layer data, we need to create 4 collisions
 // (because our collision squares are 35x35 but the tile in the
// level are 70x70)
 cells[layerIdx][y][x] = 1;
cells[layerIdx][y-1][x] = 1;
cells[layerIdx][y-1][x+1] = 1;
cells[layerIdx][y][x+1] = 1;
 }
 else if(cells[layerIdx][y][x] != 1) {
// if we haven't set this cell's value, then set it to 0 now
 cells[layerIdx][y][x] = 0;
}
 idx++;
 }
 }
 }
 
 
 
 // initialize trigger layer in collision map
	cells[LAYER_OBJECT_TRIGGERS] = [];
	idx = 0;
	for(var y = 0; y < level1.layers[LAYER_OBJECT_TRIGGERS].height; y++) {
		cells[LAYER_OBJECT_TRIGGERS][y] = [];
		for(var x =0; x < level1.layers[LAYER_OBJECT_TRIGGERS].width; x++) {
			if(level1.layers[LAYER_OBJECT_TRIGGERS].data[idx] != 0) {
				cells[LAYER_OBJECT_TRIGGERS][y][x] = 1;
				cells[LAYER_OBJECT_TRIGGERS][y-1][x] = 1;
				cells[LAYER_OBJECT_TRIGGERS][y-1][x+1] = 1;
				cells[LAYER_OBJECT_TRIGGERS][y][x+1] = 1;
			}
			else if(cells[LAYER_OBJECT_TRIGGERS][y][x] != 1) {
				// if we havent set this cells value, then set it 0 now.
				cells[LAYER_OBJECT_TRIGGERS][y][x] = 0;
			}
			idx++;
		}
	
	}
 
 
 
 
 
 	musicBackground = new Howl(
 {
	 urls: ["musicBackground.ogg"],
	 loop: true,
	 buffer: true,
	 volume: 0.5
} );
musicBackground.play();

sfxFire = new Howl(
      {
		  urls: ["fireEffect.ogg"],
		  buffer: true,
		  volume: 1,
		  onend: function() {
			  isSfxPlaying = false;
		  }
	  } );
	  
	  
	  
	  
}
function run()
{
	
	
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	
//life counter
		
	context.fillStyle = "#000000";
	context.font = "32px Ariel";
	var scoreText = "Score: "+ score;
	context.fillText(scoreText, SCREEN_WIDTH - 170, 35)
	
	
	
	
	
	
	
	
			
	
	for(var i=0; i<lives; i++)
	{
		context.drawImage(heartImage, 20 + ((heartImage.width+2)*i), 10);
	}
	
	
	var deltaTime = getDeltaTime();
	
	
	if (lives == 0){
	gameState = STATE_GAMEOVER
	}

	
	
	for(var j=0; j<enemies.length; j++)
	{
	
		if(intersects( player.position.x, player.position.y, TILE, TILE,
			enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
			{
				enemies.splice(j, 1);
				lives -=1;
				score -=1;
				break;
	
}}
	
	
	
	
	
	if (player.position.y > 800){
	
	lives -=1;
	
	}
	


	
	
	for(var j=0; j<enemies.length; j++)
	{
	
		if(intersects( player.position.x, player.position.y, TILE, TILE,
			enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
			{
				enemies.splice(j, 1);
				lives -=1;
				
				break;
	
}}
	
	if (player.position.y > 1000){
	
	lives -=1;
	
	}
	
	var hit=false;
	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].update(deltaTime);
		if( bullets[i].position.x < 0 || 
		bullets[i].position.x > player.position.x + 300 )
		{
			hit = true;
		}
		
		for(var j=0; j<enemies.length; j++)
		{
			if(intersects( bullets[i].position.x, bullets[i].position.y, TILE, TILE,
			enemies[j].position.x, enemies[j].position.y, TILE, TILE) == true)
			{
				// kill both bullet + enemy
				enemies.splice(j, 1);
				hit =true;
				// increase player score.
				score += 1;
				break;
			}
		}
		if(hit == true)
		{
			bullets.splice(i, 1);
			break;
		}
	}
	
	
	
	
	switch(gameState)
{
case STATE_SPLASH:
runSplash(deltaTime);
break;
case STATE_GAME:
runGame(deltaTime);
break;
case STATE_GAMEOVER:
runGameOver(deltaTime);
break;
}

		
	
}



initialize (); 







//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
