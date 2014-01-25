var TWEEN = require('tween');
var PIXI = require('pixi');

var FIGHTING_THRESHOLD = 15;
var MAX_MOOD = 25;

module.exports = function(stage, emitter, wall, tribe, gameOpts, dudeOpts) {
    return new Dude(stage, emitter, wall,  tribe, gameOpts, dudeOpts)
}

module.exports.Dude = Dude

var dudeMode = [
    'peaceful',
    'fighting',
    'fighting_wall',
    'building_wall',
    'destroying_wall'
];

function Dude(stage, emitter, wall, tribe, gameOpts, dudeOpts) {
    // protect against people who forget 'new'
    if (!(this instanceof Dude)) return new Dude(stage, emitter, tribe, gameOpts, dudeOpts)

    // we need to store the passed in variables on 'this'
    // so that they are available to the .prototype methods
    this.stage = stage;
    this.gameOpts = gameOpts || {};
    this.dudeOpts = dudeOpts || {};

    this.inMotion = false;
    this.tribe = tribe;
    this.wall = wall;
    this.mood = 20;
    this.gameMap = dudeOpts.gameMap;this.tribeColor = dudeOpts.tribeColor;
    this.isFirstRowFromEnd = dudeOpts.isFirstRowFromEnd;


    this.stateEnum = {
        Peaceful : 0,
        Fighting : 1,
        Fighting_Wall : 2,
        Building_Wall : 3,
        Destroying_Wall : 4,
        Fighting_Dude : 5
    };
    this.state = this.stateEnum.Fighting;
    this.sprite = new PIXI.Sprite.fromFrame(this.tribeColor + "_" + dudeMode[this.state] + ".png");
    var dude = this;
    var next = Math.random() * 3000;
    setTimeout(function() {
        dude.act();
    }, next);
}

Dude.prototype.act = function() {
    console.log("Dude acting!");
    if (this.inMotion) {
        console.log("Not acting because in motion");
        return;
    }
    var next = Math.random() * 3000;
    
    switch (this.state){
        case this.stateEnum.Peaceful:
            this.toPeacefulMode();
            break;
        case this.stateEnum.Fighting:
            var emptyWall = this.wall.getEmptyTileIndex();
            if (emptyWall != -1) {
                this.goToWallPosition(emptyWall);
            }
            break;
        case this.stateEnum.Fighting_Wall:

            break;
        case this.stateEnum.Building_Wall:
            break;
        case this.stateEnum.Destroying_Wall:

            break;
    }
    var dude = this;
    setTimeout(function() {
            dude.act();
     }, next);
}

Dude.prototype.setState = function(state) {
    this.state = state;
    this.sprite.setTexture(new PIXI.Texture.fromFrame(this.tribeColor + "_" + dudeMode[this.state] + ".png"));
    console.log("Stopping motion");
    this.inMotion = false;
    this.act();
}

Dude.prototype.toPeacefulMode = function(){
    var firstFreePeacefulTile = this.gameMap.getFirstEmptyPeacefulPosition(this.isFirstRowFromEnd);
    if(firstFreePeacefulTile){
        this.goToPosition(firstFreePeacefulTile);
    }
}

Dude.prototype.setPosition = function(position) {
    var coords = require('./coords')(this.gameOpts);
    this.sprite.position = coords.ddToAvatar(position.x, position.y);

    this.gameMap.occupyTile(position);
}

Dude.prototype.goToPosition = function(target) {
    this.gameMap.occupyTile(target);

    var coords = require('./coords')(this.gameOpts);
    target = coords.ddToAvatar(target.x, target.y);

    var lengthA = Math.abs(target.x - this.sprite.position.x);
    var lengthB = Math.abs(target.y - this.sprite.position.y);

    // pitagoras
    var lengthC = (lengthA * lengthA) + (lengthB * lengthB);
    var speedMs = lengthC * 300;

    this.gameMap.freeTile(this.sprite.position);


    var dude = this;
    console.log("Dude target: ", target);
    this.inMotion = true;
    var tween = new TWEEN.Tween(this.sprite.position)
        .to(target , 6000)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function(){

        })
        .onComplete(function(){
            dude.inMotion = false;

        }).start();
}

Dude.prototype.goToWallPosition = function(i) {
    var target = this.wall.getTilePosition(i);
    console.log("Going to ", target);
    this.goToPosition(target);
}

Dude.prototype.update = function () {
    var probTest = Math.random();
    var randFactor = Math.random();
    var effect;
    if (this.wall.opennes >= probTest) {
        effect = -1 * randFactor * 0.2;       
    } else {
        effect = 1 * randFactor * 0.2;
    }
    this.mood += effect;
    
    if (this.mood >= FIGHTING_THRESHOLD && this.state == this.stateEnum.Peaceful) {
        this.setState(this.stateEnum.Fighting);
    }
    else if (this.mood < FIGHTING_THRESHOLD && this.state == this.stateEnum.Fighting) {
        this.setState(this.stateEnum.Peaceful);
    }
    this.mood = Math.max(0, Math.min(this.mood, MAX_MOOD));

    // console.log("Dude mood " + this.mood);
  /*  if (this.mood == MAX_MOOD) {
    alert('reached max mood ' + MAX_MOOD);
    }
    if (this.mood == 0) {
        alert('reached mood 0');
    }*/

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
