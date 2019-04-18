MyGame.handlers.AsteroidHandler = (function(){
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
        let newAsteroid = MyGame.components.Asteroid(data.asteroidState);
        asteroids[data.key] = newAsteroid;
    }

    return that;
}());