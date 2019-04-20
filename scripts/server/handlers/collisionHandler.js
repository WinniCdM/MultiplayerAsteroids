// ------------------------------------------------------------------
//
// Nodejs module that represents the handler for all Missiles
//
// ------------------------------------------------------------------
'use strict';

let random = require ('../random');
let helpers = require("../helper/helperFunctions");

function collisionHandler(asteroidHandler, missileHandler, powerupHandler, ufoHandler, players){
    let that = {}

    that.handleCollisions = function(elapsedTime){
        missilesAgainstEverythingElse();
        playersAgainstEverythingElse();
    }

    function missilesAgainstEverythingElse(){
        let missiles = missileHandler.missiles;
        let ufos = ufoHandler.ufos;
        let asteroids = asteroidHandler.asteroids;

        for (let i in missiles){
            let currMissile = missiles[i];
            for (let j in asteroids){
                let currAsteroid = asteroids[j];
                if (haveCollided(currMissile.state, currAsteroid.state)){
                    if (currMissile.owner === "player"){
                        players[currMissile.clientID].player.score += calculateAsteroidScore(currAsteroid.asteroidSize);
                    }

                    asteroidHandler.handleAsteroidBreak(currAsteroid);
                    asteroidHandler.deleteAsteroid(j);
                    missileHandler.deleteMissile(i);
                }
            }

            for (let k in ufos){
                let currUFO = ufos[k];
                if (haveCollided(currMissile.state, currUFO.state)){
                    if (currMissile.owner === "player"){
                        console.log(k);
                        players[currMissile.clientID].player.score += calculateUFOScore(currUFO.isSmart);

                        ufoHandler.deleteUFO(k);
                        missileHandler.deleteMissile(i);
                        console.log(players[currMissile.clientID].player.score);
                    } //else do nothing
                }
            }
        }
    }

    function playersAgainstEverythingElse(){
        let powerups = powerupHandler.powerups;
        for (let id in players){
            let currPlayer = players[id].player;
            let currPlayerState = {
                size: currPlayer.size,
                center: currPlayer.position
            }
            // against powerups
            for (let i in powerups){
                let currPowerup = powerups[i];
                if (haveCollided(currPlayerState, currPowerup.state)){
                    currPlayer.pickupPowerup(currPowerup.type);
                    powerupHandler.deletePowerup(i);
                }
            }
        }
    }

    function haveCollided(state1, state2){
        let radiTotal = (state1.size.width / 2) + (state2.size.width / 2);
        let distance = helpers.getDistance(state1.center, state2.center);
        return (radiTotal > distance);
    }

    function calculateAsteroidScore(size){
        if (size === "large"){
            return 20;
        }
        if (size === "medium"){
            return 50;
        }
        return 100;
    }

    function calculateUFOScore(isSmart){
        if (isSmart){
            return 1000;
        }
        return 200;
    }

    return that;
};

module.exports.create = (asteroidHandler, missileHandler, powerupHandler, ufoHandler, players) => collisionHandler(asteroidHandler, missileHandler, powerupHandler, ufoHandler, players);