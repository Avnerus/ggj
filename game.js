// account for tile thickness
/* globals PIXI, kd, requestAnimFrame */
"use strict";
var PIXI = require('pixi');

// avatar is 32x32 + 6px for shadow
var AVATAR_X_OFFSET = 32 / 2;
var AVATAR_Y_OFFSET = 32 / 2;
var MAP_WIDTH = 1366;
var MAP_HEIGHT = 768;
var STAGE_WIDTH = 1366;
var STAGE_HEIGHT = 768;
var TILE_WIDTH = 50;
var TILE_HEIGHT = 50;
var THICKNESS = 8; // 10 pixels of dirt height

// isometric view and anchor at bottom left skews everything,
// basically moves the map so iso (0, 0) is near the middle top
var SKEW_X_OFFSET = STAGE_WIDTH / 2 - TILE_WIDTH;
var SKEW_Y_OFFSET = TILE_HEIGHT * 2;

var avatar;
var stage = new PIXI.Stage(0xEEFFFF);
var renderer = PIXI.autoDetectRenderer(STAGE_WIDTH, STAGE_HEIGHT);
document.body.appendChild(renderer.view);

var loader = new PIXI.AssetLoader(['assets/roadTiles.json']);

// map
var G = 0,
  D = 1,
  W = 2;
var terrain = [
  [D, D, D, D, D, D, D, D, D, D, D, D],
  [D, D, D, D, D, D, D, D, D, D, D, D],
  [D, D, D, D, D, G, G, G, D, D, D, D],
  [D, D, D, D, W, W, W, G, D, D, D, D],
  [D, D, D, D, W, W, W, G, D, D, D, D],
  [D, D, D, D, W, W, W, G, D, D, D, D],
];

// Tiles with height can exceed these dimensions.
var tileHeight = 50;
var tileWidth = 50;

// tiles
var grass = isoTile('grass.png');
var dirt = isoTile('dirtDouble.png');
var water = isoTile('water.png');
var tileMethods = [grass, dirt, water];

var avatar;
var tiles = [];

var avatar_mood_peaceful = PIXI.Texture.fromImage('assets/AvatarPeaceful.png');
var avatar_mood_fighting = PIXI.Texture.fromImage('assets/AvatarFighting.png');
var avatar_mood_fighting_wall = PIXI.Texture.fromImage('assets/AvatarFightingWall.png');
var avatar_mood_building_wall = PIXI.Texture.fromImage('assets/AvatarBuildingWall.png');
var avatar_mood_destroying_wall = PIXI.Texture.fromImage('assets/AvatarDestroyingWall.png');

function isoTile(filename) {
  return function(x, y) {
    var tile = PIXI.Sprite.fromFrame(filename);
    tile.position.x = x;
    tile.position.y = y;

    // bottom-left
    tile.anchor.x = 0.0;
    tile.anchor.y = 1;
	
	tile.buttonMode = true;
	tile.interactive = true;
	
	tile.click = function (event) {
		//set avatar movement target
		avatar.set_target(event.global);
	};

    stage.addChild(tile);
	tiles.push(tile);
  };
}

// 2D to isometric
function ddToIso(x, y) {
  return {
    x: x - y,
    y: (x + y) / 2
  };
}

function stageMap(terrain) {
  var stageTile, tileType, x, y, iso;

  for (var i = 0, iL = terrain.length; i < iL; i++) {
    for (var j = 0, jL = terrain[i].length; j < jL; j++) {
      // dd 2D coordinate
      x = j * tileWidth;
      y = i * tileHeight;

      // iso coordinate
      iso = ddToIso(x, y);

      tileType = terrain[i][j];
      stageTile = tileMethods[tileType];
      console.log("Place tile at " + iso.x + ", " + iso.y);
      stageTile(iso.x + SKEW_X_OFFSET, iso.y + SKEW_Y_OFFSET);
    }
  }
}

function Coordinates() {
  // Converts 2D coordinates to tile coordinates taking into
  // account anchor placement and thickness of tile
  function ddToTile(x, y) {
    var iso = ddToIso(x, y);
    return {
      x: iso.x + SKEW_X_OFFSET + TILE_WIDTH,
      y: iso.y + SKEW_Y_OFFSET - TILE_WIDTH - THICKNESS
    };
  }

  // Offset a 2D point keeping the point within the boundaries
  // of the map.

  function ddOffset(pt, byX, byY) {
    pt.x = Math.max(0, Math.min(pt.x + byX, MAP_WIDTH));
    pt.y = Math.max(0, Math.min(pt.y + byY, MAP_HEIGHT));
  }

  // Avatars avatar has depth too so we must ensure

  function ddToAvatar(x, y) {
    x = Math.min(MAP_WIDTH - 10, Math.max(0, x));
    y = Math.min(MAP_HEIGHT - 10, Math.max(0, y));

    var tile = ddToTile(x, y);
    return {
      x: tile.x - AVATAR_X_OFFSET,
      y: tile.y + AVATAR_Y_OFFSET
    };
  }

  return {
    ddToTile: ddToTile,
    ddToAvatar: ddToAvatar,
    ddOffset: ddOffset
  };
}
var coords = Coordinates();


function stageAvatar(x, y) {
  avatar = new PIXI.Sprite(avatar_mood_fighting);

  // track 2D position
  avatar.location = new PIXI.Point(x, y);

  var pt = coords.ddToAvatar(x, y);
  avatar.position.x = pt.x;
  avatar.position.y = pt.y;
  avatar.anchor.x = 0;
  avatar.anchor.y = 1;

  avatar.stateEnum = {
	Peaceful : 0,
	Fighting : 1,
	Fighting_Wall : 2,
	Building_Wall : 3,
	Destroying_Wall : 4
  };
  avatar.state = avatar.stateEnum.Fighting;

  avatar.set_state = function (state) {
	switch (state) {
		case avatar.stateEnum.Peaceful:
			avatar.setTexture(avatar_mood_peaceful);
		break;
		case avatar.stateEnum.fighting:
			avatar.setTexture(avatar_mood_fighting);
		break;
		case avatar.stateEnum.Fighting_Wall:
			avatar.setTexture(avatar_mood_fighting_wall);
		break;
		case avatar.stateEnum.Building_Wall:
			avatar.setTexture(avatar_mood_building_wall);
		break;
		case avatar.stateEnum.Destroying_Wall:
			avatar.setTexture(avatar_mood_destroying_wall);
		break;
		default:
			avatar.setTexture(avatar_mood_peacefull);
	}
  }
  
  avatar.set_target = function (point) {
	avatar.move_target={};
	avatar.move_target.x = point.x;
	avatar.move_target.y = point.y;
  };
  
  avatar.move = function () {
	if (avatar.move_target == null) { return; }
	
	var abs_x = Math.abs(avatar.move_target.x - avatar.position.x);
	var abs_y = Math.abs(avatar.move_target.y - avatar.position.y);
	
	if (
		abs_x > 2 ||
		abs_y > 2
	) {
		// Magic math to do smooth movement
		var v = abs_x / abs_y;
		var mov_x = 2 * v / (v + 1);
		var mov_y = 2 / (v +1);
		
		avatar.position.x +=  ((avatar.move_target.x - avatar.position.x) < 0 ? -1 : +1) * mov_x;
		avatar.position.y +=  ((avatar.move_target.y - avatar.position.y) < 0 ? -1 : +1) * mov_y;
	} else {
		avatar.move_target = null;
		avatar.set_state(avatar.stateEnum.Building_Wall);
	}
  };
  
  stage.addChild(avatar);
  return avatar;
}


loader.onComplete = start;
loader.load();

function start() {
  stageMap(terrain);
  avatar = stageAvatar(0, 0);

  function animate() {
    // keyboard handler
    // kd.tick();
	
	avatar.move();

	requestAnimationFrame(animate);
    renderer.render(stage);
  }
  requestAnimationFrame(animate);
}
