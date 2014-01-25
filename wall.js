var PIXI = require('pixi');

module.exports = function(stage, emitter, opts) {
  return new Wall(stage, emitter, opts)
}

module.exports.Wall = Wall

function Wall(stage, emitter, opts) {
   // protect against people who forget 'new'
   if (!(this instanceof Wall)) return new Wall(stage, emitter, opts)

    // we need to store the passed in variables on 'this'
    // so that they are available to the .prototype methods
    this.stage = stage
    this.opts = opts || {}
    this.emitter = emitter;

    this.stateEnum = {
        Normal : 0,
        Broken : 1
    };
    
    this.states =  [
        this.stateEnum.Normal,
        this.stateEnum.Normal,
        this.stateEnum.Normal,
        this.stateEnum.Broken,
        this.stateEnum.Normal,
        this.stateEnum.Normal,
        this.stateEnum.Normal
    ];

    this.textures = [ 
        'wall_normal.png',
        'wall_broken.png'
    ]

    this.tiles = [];
}

Wall.prototype.stageMap= function(terrain) {
  var stageTile, tileType, x, y, iso;
  var coords = require('./coords')(this.opts);

  for (var i = 0, iL = this.states.length; i < iL; i++) {
      y = i * this.opts.tileHeight;
      x = 0;

      // iso coordinate
      iso = coords.ddToIso(x, y);
      stageTile = this.isoTile(); 
      if (stageTile) {
         console.log("Place tile at " + iso.x + ", " + iso.y);
         stageTile(this, i, iso.x + this.opts.skewXOffset, iso.y + this.opts.skewYOffset);
      }
  }
}

Wall.prototype.getTilePosition = function(i) {
   return {x: 0, y: i * this.opts.tileHeight }
}


Wall.prototype.isoTile = function() {
  return function(wall, index, x, y) {
    var tile = PIXI.Sprite.fromFrame(wall.textures[wall.states[index]]);
    tile.position.x = x;
    tile.position.y = y;

    // bottom-left
    tile.anchor.x = 0.0;
    tile.anchor.y = 1;

    tile.buttonMode = true;
    tile.interactive = true;
    tile.index = index;

    tile.click = function (event) {
       wall.tileClicked(tile);
    };

    wall.tiles.push(tile);
    wall.stage.addChild(tile);
  };
}

Wall.prototype.tileClicked = function(tile) {
    var currentState = this.states[tile.index];
    if (currentState == this.stateEnum.Normal) {
        this.setTileState(tile, this.stateEnum.Broken);
    } else if (currentState == this.stateEnum.Broken) {
        this.setTileState(tile, this.stateEnum.Normal);
    }
}

Wall.prototype.setTileState = function(tile, state) {
    this.states[tile.index] = state;
    tile.setTexture(new PIXI.Texture.fromFrame(this.textures[state]));
    this.emitter.emit('wallChanged',{index: tile.index, state: state} );
}



Wall.prototype.place = function(position) {
   console.log("Placing wall");
   this.stageMap();
}
