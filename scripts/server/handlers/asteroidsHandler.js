let Asteroid = require("../objects/asteroid");
let Helper = require("../../shared/helper/helperFunctions");

function asteroidHandler(){
    let that = {};
    let asteroids = [];

    Object.defineProperty(that, 'asteroids', {
        get: () => asteroids
    })

    that.update = function(elapsedTime){
        for (let i = 0; i < asteroids.length; i++){
            asteroids[i].update(elapsedTime);
        }
    }

    that.createNewRandomAsteroid = function(number){
        for (let i = 0; i < number; i++){
            asteroids.push(Asteroid.create(
                HelperFunctions.generateNewRandomCenter(), 
                "large"
                )
            );
        }
    }

    that.handleAsteroidBreak = function(oldAsteroid){
        if (oldAsteroid.asteroidSize === "large"){
            //create 3 medium asteroids
        } else if (oldAsteroid.asteroidSize === "medium"){
            //create 4 small
        }
    }

    return that;
};

module.exports.createAsteroidHandler = () => asteroidHandler();