var TWEEN = require('tween');
var PIXI = require('pixi');

module.exports = function(stage, tribe, opts) {
  return new Dude(stage, tribe,  opts)
}

module.exports.Dude = Dude

var dude_mode = [
    'peacefull',    
    'fighting', 
    'fighting_wall',
    'building_wall',
    'destroying_wall'
];

function Dude(stage, tribe, opts) {
   // protect against people who forget 'new'
   if (!(this instanceof Dude)) return new Dude(stage, opts)

   // we need to store the passed in variables on 'this'
   // so that they are available to the .prototype methods
   this.stage = stage
   this.opts = opts || {}
   this.tribe = tribe;
   
    this.stateEnum = {
        Peaceful : 0,
        Fighting : 1,
        Fighting_Wall : 2,
        Building_Wall : 3,
        Destroying_Wall : 4
    };
    this.state = this.stateEnum.Fighting;
    this.sprite = new PIXI.Sprite.fromFrame(this.tribe + "_" + dude_mode[this.state] + ".png");
}

Dude.prototype.setState = function(state) {
    this.state = state;
    this.sprite.texture = new PIXI.Sprite.Texture.fromFrame(this.tribe + "_" + dude_mode[state] + ".png");
}

Dude.prototype.setPosition = function(position) {
    var coords = require('./coords')(this.opts);
    this.sprite.position = coords.ddToAvatar(position.x, position.y);
}

Dude.prototype.goToWallPosition = function(i) {
   var coords = require('./coords')(this.opts);
   var wall = require('./wall')(this.stage, this.opts);
   var target = wall.getTilePosition(i);
   target = coords.ddToAvatar(target.x, target.y);
   console.log("Dude target: ", target);
   var tween = new TWEEN.Tween(this.sprite.position)
      .to(target , 6000 )
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(function(){

       }).start();
}


Dude.prototype.move = function () {
    if (this.move_target == null) { return; }

    var abs_x = Math.abs(this.move_target.x - this.sprite.position.x);
    var abs_y = Math.abs(this.move_target.y - this.sprite.position.y);

    if (abs_x > 2 ||
        abs_y > 2) {
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

Dude.prototype.place = function(position) {
   console.log("Placing Dude");
   this.stage.addChild(this.sprite);
}
