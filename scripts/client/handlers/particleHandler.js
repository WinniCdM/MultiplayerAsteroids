MyGame.handlers.ParticleHandler = (function(){
    'use strict';
    let that = {}
    let particleSubsystems = [];

//Center and size should all be in ViewPort Units x:0->2, y:0->1 this is converted to canvas units at render

    that.update = function(elapsedTime){
        for (let key in asteroids){
            asteroids[key].update(elapsedTime);
        }
    }

    that.reset = function(elapsedTime){
        particleSubsystems = [];
    }

    return that;
}());