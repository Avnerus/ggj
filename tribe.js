var PIXI = require('pixi');

module.exports = function(stage, emitter, opts) {
    return new Tribe(stage, emitter, opts)
}

module.exports.Tribe = Tribe;

function Tribe(stage, emitter, tribeOpts, gameOpts) {
    // protect against people who forget 'new'
    if (!(this instanceof Tribe)) return new Tribe(stage, emitter, tribeOpts, gameOpts)

    // we need to store the passed in variables on 'this'
    // so that they are available to the .prototype methods

    this.stage = stage;
    this.tribeOpts = tribeOpts || {};
    this.gameOpts = gameOpts || {};

    this.peoplePerTribe = tribeOpts.peoplePerTribe;
    this.initX = tribeOpts.initX;
    this.initY = tribeOpts.initY;
    this.tribeColor = tribeOpts.tribeColor;
    this.emitter = emitter;


    this.tribePeople = [];
    this.initTribe();

}

//TODO: still need to edit below this point!

Tribe.prototype.initTribe = function() {
    var x = this.initX;
    var y = this.initY;
    for (var i=0; i < this.tribeOpts.peoplePerTribe; i++) {
        var dude = require('./dude')(this.stage, this.emitter, this.tribeColor,  this.gameOpts);
        dude.setPosition({x: x, y: y});
        dude.place();
//        dude.goToWallPosition(4);

        y += 30;

        this.tribePeople.push(dude);
    }
}
