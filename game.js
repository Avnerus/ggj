// account for tile thickness
/* globals PIXI, kd, requestAnimFrame */
"use strict";
var PIXI = require('pixi');
var TWEEN = require('tween');

// avatar is 32x32 + 6px for shadow
var AVATAR_X_OFFSET = 32 / 2;
var AVATAR_Y_OFFSET = 32 / 2;
var MAP_WIDTH = 1024;
var MAP_HEIGHT = 768;
var STAGE_WIDTH = 1024;
var STAGE_HEIGHT = 768;
var TILE_WIDTH = 94;
var TILE_HEIGHT = 97;
var THICKNESS = 8; // 10 pixels of dirt height

// isometric view and anchor at bottom left skews everything,
// basically moves the map so iso (0, 0) is near the middle top
var SKEW_X_OFFSET = STAGE_WIDTH / 2 - TILE_WIDTH + 240 ;
var SKEW_Y_OFFSET = TILE_HEIGHT * 2 + 180;


var gameOpts = {
   avatarXOffset: AVATAR_X_OFFSET,
   avatarYOffset: AVATAR_Y_OFFSET,
   mapWidth: MAP_WIDTH,
   mapHeight: MAP_HEIGHT,
   stageWidth: STAGE_WIDTH,
   stageHeight: STAGE_HEIGHT,
   tileWidth: TILE_WIDTH,
   tileHeight: TILE_HEIGHT,
   thickness: THICKNESS,
   skewXOffset: SKEW_X_OFFSET,
   skewYOffset: SKEW_Y_OFFSET
}

var avatar;
var stage = new PIXI.Stage(0xEEFFFF);
var renderer = new PIXI.autoDetectRenderer(STAGE_WIDTH, STAGE_HEIGHT);
document.body.appendChild(renderer.view);

var loader = new PIXI.AssetLoader(['assets/walls.json', 'assets/dudes.json']);

// Background
var bg = new PIXI.Sprite.fromImage("assets/terrain.png");
bg.anchor.x = 0.5;
bg.anchor.y = 0.5;
bg.position.x = STAGE_WIDTH / 2;
bg.position.y = STAGE_HEIGHT /2;
stage.addChild(bg);

// Wall
var wall = require('./wall')(stage, gameOpts);
var coords = require('./coords')(gameOpts);

var twist = new PIXI.TwistFilter();
twist.radius = 0;
stage.filters = [twist];

loader.onComplete = start;
loader.load();

function start() {
  var x = 250;
  var y = 100;
  for (var i = 0; i < 7; i++) {
     var dude = require('./dude')(stage, "green",  gameOpts);
     dude.setPosition({x: x, y: y});
     dude.place();
     dude.goToWallPosition(4);     

     y += 100;
  }
  wall.place();

  function animate() {
    // keyboard handler
    // kd.tick();
    requestAnimationFrame(animate);
    twist.radius += 0.01;
    TWEEN.update();
    renderer.render(stage);
  }
  requestAnimationFrame(animate);
}
