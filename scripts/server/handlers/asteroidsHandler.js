// ------------------------------------------------------------------
//
// Nodejs module that represents the model for an asteroid handler 
// object.
//
// ------------------------------------------------------------------
let Asteroid = require("../objects/asteroid");
let Helper = require("../../shared/helper/helperFunctions");

// ------------------------------------------------------------------
//
// Public function to create a new asteroid handler
//
// ------------------------------------------------------------------
function asteroidHandler(){
    let that = {};
    let asteroids = {};
    let newAsteroids = []; //list of ids
    let id = 0;

    Object.defineProperty(that, 'asteroids', {
        get: () => asteroids
    });

    Object.defineProperty(that, 'newAsteroids', {
        get: () => newAsteroids
    });

    function getIdForNewAsteroid(){
        let newId = id++
        newAsteroids.push(newId);
        return newId;
    }

    that.update = function(elapsedTime){
        for (let i = 0; i < asteroids.length; i++){
            asteroids[i].update(elapsedTime);
        }
    }

    that.createNewRandomAsteroid = function(number){
        for (let i = 0; i < number; i++){
            asteroids.push(
                getIdForNewAsteroid(), 
                Asteroid.create(
                    HelperFunctions.generateNewRandomCenter(), 
                    "large"
                    )
            );
        }
    }

    that.createNewAsteroidAtCenter = function(size, center){
        asteroids.push(
            getIdForNewAsteroid(),
            Asteroid.create(center, size)
            );
    }

    that.handleAsteroidBreak = function(oldAsteroid){
        if (oldAsteroid.asteroidSize === "large"){
            for (let i = 0; i < 3; i ++){
                that.createNewAsteroidAtCenter("medium", oldAsteroid.center)
            }
        } else if (oldAsteroid.asteroidSize === "medium"){
            for (let i = 0; i < 4; i ++){
                that.createNewAsteroidAtCenter("small", oldAsteroid.center)
            }
        }
    }

    that.deleteAsteroid = function(id){
        delete asteroids[id];
    }

    return that;
};

module.exports.create = () => asteroidHandler();