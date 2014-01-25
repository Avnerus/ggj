var TWEEN = require('tween');
var PIXI = require('pixi');

module.exports = function(stage, emitter, tribe, opts) {
    return new Dude(stage, emitter, tribe,  opts)
}

module.exports.Dude = Dude

var dude_mode = [
    'peacefull',
    'fighting',
    'fighting_wall',
    'building_wall',
    'destroying_wall'
];

function Dude(stage, emitter, tribe, opts) {
    // protect against people who forget 'new'
    if (!(this instanceof Dude)) return new Dude(stage, emitter, tribe, opts)

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
    var wall = require('./wall')(this.stage,this.emitter, this.opts);

    var target = wall.getTilePosition(i);
    target = coords.ddToAvatar(target.x, target.y);

    var lengthA = Math.abs(target.x - this.sprite.position.x);
    var lengthB = Math.abs(target.y - this.sprite.position.y);

    // pitagoras
    var lengthC = (lengthA * lengthA) + (lengthB * lengthB);
    var speedMs = lengthC * 300; 

    console.log("Dude target: ", target);
    var tween = new TWEEN.Tween(this.sprite.position)
        .to(target , speedMs)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function(){

        }).start();
}


Dude.prototype.move = function () {


}

//Dude.prototype.move = function () {
//    if (this.moveTarget == null) { return; }
//
//    var absX = Math.abs(this.moveTarget.x - this.sprite.position.x);
//    var absY = Math.abs(this.moveTarget.y - this.sprite.position.y);
//
//    if (absX > 2 ||
//        absY > 2) {
//        // Magic math to do smooth movement
//        var v = absX / absY;
//        var movX = 2 * v / (v + 1);
//        var movY = 2 / (v +1);
//
//        this.sprite.position.x +=  ((this.moveTarget.x - this.sprite.position.x) < 0 ? -1 : +1) * movX;
//        this.sprite.position.y +=  ((this.moveTarget.y - this.sprite.position.y) < 0 ? -1 : +1) * movY;
//    } else {
//        this.moveTarget = null;
//        this.setState(avatar.stateEnum.Building_Wall);
//    }
//}

Dude.prototype.place = function(position) {
    console.log("Placing Dude");
    this.stage.addChild(this.sprite);
}
