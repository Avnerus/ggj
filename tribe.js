var PIXI = require('pixi');

module.exports = function(stage, opts) {
  return new Tribe(stage, opts)
}

module.exports.Tribe = Tribe

function Tribe(stage, opts) {
   // protect against people who forget 'new'
   if (!(this instanceof Tribe)) return new Tribe(stage, opts)

   // we need to store the passed in variables on 'this'
   // so that they are available to the .prototype methods
   this.stage = stage
   this.opts = opts || {}

   this.people = [];
}

//TODO: still need to edit below this point!

Tribe.prototype.initTribe() {
    for (var i=0; i < this.opts.peoplePerTribe; i++) {
        var person = PIXI.Sprite.fromFrame('assets/AvatarFighting.png');
        
        
    }
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
      console.log("Place tile at " + iso.x + ", " + iso.y);
      stageTile(this.stage, iso.x + this.opts.skewXOffset, iso.y + this.opts.skewYOffset);
    }
  }
}

Wall.prototype.isoTile = function(filename) {
  return function(stage, x, y) {
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

    this.tiles.push(tile);
    stage.addChild(tile);
  };
}


Wall.prototype.place = function(position) {
   console.log("Placing wall");
   this.stageMap(terrain);
}
