MyGame.handlers.PowerupHandler = (function(){
    'use strict';
    let that = {};
    let powerups = {};

    Object.defineProperty(thhat, 'powerups', {
        get: () => powerups
    });

    that.update = function(elapsedTime){
        for (let key in powerups){
            powerups[key].update(elapsedTime);
        }
    }

    that.createPowerup = function(data){
        let newPowerup = MyGame.components.Powerup(data.powerupState, MyGame.assets["asteroids"]);
        powerups[data.key] = newPowerup;
    }

    that.deletePowerup = function(id){
        delete powerups[id];
    }

    return that;
}())