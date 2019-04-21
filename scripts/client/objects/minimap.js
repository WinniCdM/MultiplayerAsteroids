//------------------------------------------------------------------
//
// Model for the minimap in the game.
//
//------------------------------------------------------------------

MyGame.components.Minimap = function(viewport,handlers){
    'use strict';
    let that = {};
    //need the following: everything will be converted from GWU to Minimap
    //0->10 GWU => 0->.2 Minimap Units
    // viewport location
    // asteroids
    // ufos
    // player
    // other players
    let convert = .04;

    that.miniViewport = {
        x:viewport.position.x * convert,
        y:viewport.position.y * convert
    }
    // console.log('main', MyGame.main);

    that.playerCenter = {
        x: 0,
        y: 0
    }

    that.asteroidCenters = [];
    that.clearAsteroids = function(){
        that.asteroidCenters = [];
    }

    that.ufoCenters = [];
    that.clearUFOs = function(){
        that.ufoCenters = [];
    }

    that.powerupCenters = [];
    that.clearPowerups = function(){
        that.powerupCenters = [];
    }

    that.otherPlayersCenters = [];
    that.clearOtherPlayers = function(){
        that.otherPlayersCenters = [];
    }


    that.update = function(){
        //viewport
        that.miniViewport = {
            x:viewport.position.x * convert,
            y:viewport.position.y * convert
        }
        //player
        that.playerCenter = {
            x: MyGame.main.playerSelf.model.position.x * convert,
            y: MyGame.main.playerSelf.model.position.y * convert,
        }

        //asteroids
        let asteroids = handlers.AsteroidHandler.asteroids;
        for(let id in asteroids){
            let newCenter = {
                x:asteroids[id].state.center.x * convert,
                y:asteroids[id].state.center.y * convert
            }
            that.asteroidCenters.push(newCenter);
        }

        //ufos
        let ufos = handlers.UFOHandler.ufos;
        for(let id in ufos){
            let newCenter = {
                x:ufos[id].state.center.x * convert,
                y:ufos[id].state.center.y * convert
            }
            that.ufoCenters.push(newCenter);
        }

        //powerups
        let powerups = handlers.PowerupHandler.powerups;
        for(let id in powerups){
            let newCenter = {
                x:powerups[id].state.center.x * convert,
                y:powerups[id].state.center.y * convert
            }
            that.powerupCenters.push(newCenter);
        }

        //other Players
        let otherPlayers = MyGame.main.playerOthers;
        for(let id in otherPlayers){
            let newCenter = {
                x:otherPlayers[id].model.state.position.x * convert,
                y:otherPlayers[id].model.state.position.y * convert
            }
            that.otherPlayersCenters.push(newCenter);
        }

    }
    return that;
}