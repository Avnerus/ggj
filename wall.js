var PIXI = require('pixi');

// map
var W = 0,
  H = 1,
  N = 2;
var terrain = [
  [W],
  [W],
  [W],
  [H],
  [W],
  [W],
  [W]
];

module.exports = function(stage, opts) {
  return new Wall(stage, opts)
}

module.exports.Wall = Wall

function Wall(stage, opts) {
   // protect against people who forget 'new'
   if (!(this instanceof Wall)) return new Wall(stage, opts)

   // we need to store the passed in variables on 'this'
   // so that they are available to the .prototype methods
   this.stage = stage
   this.opts = opts || {}

   // tiles
   var normal = this.isoTile('wall.png');
   this.tileMethods = [normal];
   
   this.tiles = [];
}

Wall.prototype.stageMap= function(terrain) {
  var stageTile, tileType, x, y, iso;
  var coords = require('./coords')(this.opts);

  for (var i = 0, iL = terrain.length; i < iL; i++) {
    for (var j = 0, jL = terrain[i].length; j < jL; j++) {
      // dd 2D coordinate
      x = j * this.opts.tileWidth;
      y = i * this.opts.tileHeight;

      // iso coordinate
      iso = coords.ddToIso(x, y);

      tileType = terrain[i][j];
      stageTile = this.tileMethods[tileType];
      if (stageTile) {
         console.log("Place tile at " + iso.x + ", " + iso.y);
         stageTile(this, iso.x + this.opts.skewXOffset, iso.y + this.opts.skewYOffset);
      }
    }
  }
}

Wall.prototype.getTilePosition = function(i) {
   return {x: 0, y: i * this.opts.tileHeight }
}


Wall.prototype.isoTile = function(filename) {
  return function(wall, x, y) {
    var tile = PIXI.Sprite.fromFrame(filename);
    tile.position.x = x;
    tile.position.y = y;

    // bottom-left
    tile.anchor.x = 0.0;
    tile.anchor.y = 1;

    tile.buttonMode = true;
    tile.interactive = true;

    tile.click = function (event) {
        //TODO: set player tribe, peaceful people, target
    };

    wall.tiles.push(tile);
    wall.stage.addChild(tile);
  };
}


Wall.prototype.place = function(position) {
   console.log("Placing wall");
   this.stageMap(terrain);
}
