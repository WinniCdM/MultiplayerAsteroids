MyGame.handlers.AsteroidHandler = (function(){
    'use strict';
    let that = {}
    let asteroids = {};

    Object.defineProperty(that, 'asteroids', {
        get: () => asteroids
    });

    that.update = function(elapsedTime){
        for (let key in asteroids){
            asteroids[key].update(elapsedTime);
        }
    }

    that.createAsteroid = function(data){
        let newAsteroid = MyGame.components.Asteroid(data.asteroidState, MyGame.assets['asteroid']);
        asteroids[data.key] = newAsteroid;
    }

    that.deleteAsteroid = function(id){
        delete asteroids[id];
    }

    return that;
}());