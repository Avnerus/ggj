var PIXI = require('pixi');

module.exports = function(stage, opts) {
  return new Ddue(stage, opts)
}

module.exports.Dude = Dude

var dude_mode = [
    PIXI.Texture.fromImage('assets/AvatarPeaceful.png'),
    PIXI.Texture.fromImage('assets/AvatarFighting.png'),
    PIXI.Texture.fromImage('assets/AvatarFightingWall.png'),
    PIXI.Texture.fromImage('assets/AvatarBuildingWall.png'),
    PIXI.Texture.fromImage('assets/AvatarDestroyingWall.png')
 ];

function Dude(stage, opts) {
   // protect against people who forget 'new'
   if (!(this instanceof Dude)) return new Dude(stage, opts)

   // we need to store the passed in variables on 'this'
   // so that they are available to the .prototype methods
   this.stage = stage
   this.opts = opts || {}
   
    this.stateEnum = {
        Peaceful : 0,
        Fighting : 1,
        Fighting_Wall : 2,
        Building_Wall : 3,
        Destroying_Wall : 4
    };
    this.state = this.stateEnum.Fighting;
    this.sprite = new PIXI.Sprite.fromFrame(this.);
}

Dude.prototype.setState = function(state) {
    this.state = state;
    this.sprite.setTexture(dude_mode[state]);
}

Dude.prototype.move = function () {
    if (this.move_target == null) { return; }

    var abs_x = Math.abs(this.move_target.x - this.sprite.position.x);
    var abs_y = Math.abs(this.move_target.y - this.sprite.position.y);

    if (
        abs_x > 2 ||
        abs_y > 2
    ) {
        // Magic math to do smooth movement
        var v = abs_x / abs_y;
        var mov_x = 2 * v / (v + 1);
        var mov_y = 2 / (v +1);
        
        this.sprite.position.x +=  ((this.move_target.x - this.sprite.position.x) < 0 ? -1 : +1) * mov_x;
        this.sprite.position.y +=  ((this.move_target.y - this.sprite.position.y) < 0 ? -1 : +1) * mov_y;
    } else {
        this.move_target = null;
        this.set_state(avatar.stateEnum.Building_Wall);
    }
}

//TODO: still need to edit below this point!

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
