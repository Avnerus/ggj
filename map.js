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
                y:50 + (tileHeight * j),
                isBlockOccupied: false
            }
        }
    }
}

Map.prototype.getFirstEmptyPeacefulPosition = function(){
    console.log('getFirstEmptyPeacefulPosition ');

    for(var i = 0; i < this.numTilesWidth; i++){
        for(var j = 0; j  < this.numTilesHeight; j++){
            var tile = this.mapMatrix[i][j];
            if(!tile.isBlockOccupied){
                return tile;
            }
        }
    }
}

Map.prototype.freeTile = function(position){
    var closestTile = this.getClosestTile(position);
    if(closestTile && !closestTile.isBlockOccupied){
        closestTile.isBlockOccupied = false;
    }
}

Map.prototype.occupyTile = function(position){
    var closestTile = this.getClosestTile(position);
    if(closestTile && !closestTile.isBlockOccupied){
        closestTile.isBlockOccupied = true;
    }
}

Map.prototype.getClosestFreeTile = function(position){
    var x = position.x;
    var y = position.y;
    for(var i = 0; i < this.numTilesWidth; i++){
        for(var j = 0; j  < this.numTilesHeight; j++){
            var tile = this.mapMatrix[i][j];
            if(Math.abs(x - tile.x) < 30 && Math.abs(y - tile.y) < 30 && tile.isBlockOccupied == false){
                return tile;
            }
        }
    }

    return null;
}

Map.prototype.getClosestTile = function(position){
    var x = position.x;
    var y = position.y;
    for(var i = 0; i < this.numTilesWidth; i++){
        for(var j = 0; j  < this.numTilesHeight; j++){
            var tile = this.mapMatrix[i][j];
            if(Math.abs(x - tile.x) < 30 && Math.abs(y - tile.y) < 30){
                return tile;
            }
        }
    }

    return null;
}

Map.prototype.isTileEmpty = function(position){
    var closestTile = this.getClosestTile(position);
    if(closestTile){
        return !closestTile.isBlockOccupied;
    }
    return false;
}

