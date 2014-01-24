// account for tile thickness
/* globals PIXI, kd, requestAnimFrame */
"use strict";
var PIXI = require('pixi');

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
var SKEW_X_OFFSET = STAGE_WIDTH / 2 - TILE_WIDTH + 250 ;
var SKEW_Y_OFFSET = TILE_HEIGHT * 2 + 160;


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

var loader = new PIXI.AssetLoader(['assets/walls.json']);

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


function stageAvatar(x, y) {
  var avatar = PIXI.Sprite.fromImage('assets/redOrb.png');

  // track 2D position
  avatar.location = new PIXI.Point(x, y);

  var pt = coords.ddToAvatar(x, y);

  avatar.position.x = pt.x;
  avatar.position.y = pt.y;
  avatar.anchor.x = 0;
  avatar.anchor.y = 1;

  stage.addChild(avatar);
  return avatar;
}


loader.onComplete = start;
loader.load();

function start() {
  wall.place();
  avatar = stageAvatar(0, 0);
  console.log("BOOO");

  function animate() {
    // keyboard handler
    // kd.tick();
    requestAnimationFrame(animate);
    renderer.render(stage);
  }
  requestAnimationFrame(animate);
}
