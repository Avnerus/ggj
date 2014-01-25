/**
 * Created by amit on 1/25/14.
 */


module.exports = function(stage, emitter, gameOpts) {
    return new Map(stage, emitter, gameOpts)
}

module.exports.Map = Map;

function Map(stage, emitter, gameOpts) {

    if (!(this instanceof Map)) return new Map(stage, emitter, gameOpts);

    this.gameOpts = gameOpts;
    this.initMap();

}

Map.prototype.initMap = function(){
    var gameOpts =  this.gameOpts;
    var tileWidth = 30;
    var tileHeight = 30;

    this.numTilesWidth = parseInt(gameOpts.mapWidth / tileWidth);
    this.numTilesHeight = parseInt(gameOpts.mapHeight / tileHeight);

    this.mapMatrix = [];
    for(var i = 0; i < this.numTilesWidth; i++){
        this.mapMatrix[i] = [];

        for(var j = 0; j  < this.numTilesHeight; j++){
            this.mapMatrix[i][j] = {
                x: -410 + (tileWidth * i),
                y:70 + (tileHeight * j),
                isBlockOccupied: false
            }
        }
    }
}

Map.prototype.getFirstEmptyPeacefulPosition = function(){
    for(var i = 0; i < this.numTilesWidth; i++){
        for(var j = 0; j  < this.numTilesHeight; j++){
            var tile = numTilesWidth[i][j];
            if(!tile.isBlockOccupied){
                return tile;
            }
        }
    }
}

Map.prototype.occupyTile = function(x, y){
    var closestTile = this.getClosestTile(x, y);
    if(!closestTile.isBlockOccupied){
        closestTile.isBlockOccupied = true;
    }
}

Map.prototype.getClosestTile = function(x, y){
    for(var i = 0; i < this.numTilesWidth; i++){
        for(var j = 0; j  < this.numTilesHeight; j++){
            var tile = this.mapMatrix[i][j];
            if(Math.abs(x - tile.x) < 30 && Math.abs(y - tile.y) < 30){
                return tile;
            }
        }
    }
}

Map.prototype.isTileEmpty = function(x, y){
    var closestTile = this.getClosestTile(x, y);
    if(closestTile){
        return !closestTile.isBlockOccupied;
    }
    return false;
}

