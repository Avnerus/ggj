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
    this.tileWidth = 30;
    this.tileHeight = 30;

    this.numTilesWidth = parseInt((gameOpts.mapWidth - 145) / this.tileWidth);
    this.numTilesHeight = parseInt(gameOpts.mapHeight / this.tileHeight);

    this.mapMatrix = [];
    for(var i = 0; i < this.numTilesWidth; i++){
        this.mapMatrix[i] = [];

        for(var j = 0; j  < this.numTilesHeight; j++){
            this.mapMatrix[i][j] = {
                x: -410 + (this.tileWidth * i),
                y:50 + (this.tileHeight * j),
                isBlockOccupied: false
            }
        }
    }
}

Map.prototype.getFirstEmptyPeacefulPosition = function(isFirstRowFromEnd){
    if(!isFirstRowFromEnd){
        for(var i = 0; i < this.numTilesWidth; i++){
            for(var j = 0; j  < this.numTilesHeight; j++){
                var tile = this.mapMatrix[i][j];
                if(!tile.isBlockOccupied){
                    return tile;
                }
            }
        }
    }else{
        for(var i = this.numTilesWidth - 1; i >= 0; i--){
            for(var j = this.numTilesHeight - 1; j  >= 0; j--){
                var tile = this.mapMatrix[i][j];
                if(!tile.isBlockOccupied){
                    return tile;
                }
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
            if(Math.abs(x - tile.x) < this.tileWidth && Math.abs(y - tile.y) < this.tileHeight && tile.isBlockOccupied == false){
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
            if(Math.abs(x - tile.x) < this.tileWidth && Math.abs(y - tile.y) < this.tileHeight){
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

