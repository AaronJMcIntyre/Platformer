var LEFT = 0;
var RIGHT =1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;
var ANIM_MAX = 6;

var ANIM_CLIMB = 7;





var Enemy = function(x, y) {	


    this.sprite = new Sprite("bat.png")
	this.sprite.buildAnimation(2, 1, 88, 94, 0.3, [0,1]);
	this.sprite.setAnimation(0, -35, -40);
	
	this.position = new Vector2();
	this.position.set(x, y);
	
	this.velocity = new Vector2();
	
	this.moveRight = true;
	this.pause = 0;
		  
    for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}		

	this.position = new Vector2();
	this.position.set(9*TILE, 0*TILE );
		
	this.width = 159;
	this.height = 163;	
   
    this.velocity = new Vector2();
    this.falling = true;
    this.jumping = false;

	this.direction = LEFT;   



	
};

Player.prototype.update = function(dt)
{	
   this.sprite.update(dt);
   
    if(this.pause > 0)
	{
		this.pause -=dt;
		
	}
	else
	{
		var ddx = 0;
		
		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);
		var nx = (this.position.x)%TILE;
		var ny = (this.position.y)%TILE;
		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);
		
		if(this.moveRight)
		{
			if(celldiag && !cellright){
				ddx = ddx + ENEMY_ACCEL; // Enemy wants to move right.			}
		}
		else {
			this.velocity.x = 0;
			this.moveRight = false;
			this.pause = 0.5;
		}
	}
	
	if(!this.movrRight)
	{
		if(celldown && !cell) {
			ddx = ddx - ENEMY_ACCEL;  // enemy wants to move left    
		}
		else {
			this.velocity.x = 0;
			this.moveRight = true;
			this.pause = 0.5;
		}
	}
	this.position.x = Math.floor(this.position.x + (dt * this.velocity.x));
	this.velocity.x = bound(this.velocity.x + (dt * ddx),
	                             -ENEMY_MAXDX, ENEMY_MAXDX);

								 
}
}



Player.prototype.draw = function()
{
	
    this.sprite.draw(context, this.position.x, this.position.y);
    
	
}

