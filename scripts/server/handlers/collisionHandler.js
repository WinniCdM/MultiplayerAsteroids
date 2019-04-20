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
        missilesAgainstAsteroids();
    }

    function missilesAgainstAsteroids(){
        let missiles = missileHandler.missiles;
        let asteroids = asteroidHandler.asteroids;

        for (let i in missiles){
            let currMissile = missiles[i];
            for (let j in asteroids){
                let currAsteroid = asteroids[j];
                if (haveCollided(currMissile.state, currAsteroid.state)){
                    //check if its ally or enemy
                    //if ally, give points to appropriate player
                    //if enemy, just delete cause the EXPLOSIONS
                    asteroidHandler.handleAsteroidBreak(currAsteroid);
                    asteroidHandler.deleteAsteroid(j);
                    missileHandler.deleteMissile(i);
                }
            }
        }
    }

    function haveCollided(state1, state2){
        let radiTotal = (state1.size.width / 2) + (state2.size.width / 2);
        let distance = helpers.getDistance(state1.center, state2.center);
        return (radiTotal > distance);
    }

    return that;
};

module.exports.create = (asteroidHandler, missileHandler, powerupHandler, ufoHandler, players) => collisionHandler(asteroidHandler, missileHandler, powerupHandler, ufoHandler, players);