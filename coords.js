module.exports = function(opts) {
  return new Coordinates(opts)
}

module.exports.Coordinates = Coordinates;


function Coordinates(opts) {
  // Converts 2D coordinates to tile coordinates taking into
  // account anchor placement and thickness of tile
  
  this.opts = opts || {};
}

Coordinates.prototype.ddToTile = function(x, y) {
 var iso = this.ddToIso(x, y);
 return {
   x: iso.x + this.opts.skewXOffset + this.opts.tileWidth,
   y: iso.y + this.opts.skewYOffset - this.opts.tileWidth - this.opts.thickness
 };
}

  // Offset a 2D point keeping the point within the boundaries
  // of the map.

Coordinates.prototype.ddOffset = function(pt, byX, byY) {
    pt.x = Math.max(0, Math.min(pt.x + byX, this.opts.mapWidth));
    pt.y = Math.max(0, Math.min(pt.y + byY, this.opts.mapHeight));
}

  // Avatars avatar has depth too so we must ensure

Coordinates.prototype.ddToAvatar = function(x, y) {
//    x = Math.min(this.opts.mapWidth - 10, Math.max(0, x));
//    y = Math.min(this.opts.mapHeight - 10, Math.max(0, y));
   
    var tile = this.ddToTile(x, y);
    console.log(tile);
    return {
      x: tile.x - this.opts.avatarXOffset,
      y: tile.y + this.opts.avatarYOffset
    };
}

Coordinates.prototype.ddToIso = function(x, y) {
  console.log("ddToIso: " + x + ", " + y);
  return {
    x: (x - y) / 1.65,
    y: (x + y) / 2.89 
  };
}
