MyGame.handlers.PowerupHandler = (function(){
    'use strict';
    let that = {};
    let powerups = {};

    Object.defineProperty(that, 'powerups', {
        get: () => powerups
    });

    that.update = function(elapsedTime){
        for (let key in powerups){
            powerups[key].update(elapsedTime);
        }
    }

    that.createPowerup = function(data){
        let texture = MyGame.assets[getTexture(data.message.type)];
        let newPowerup = MyGame.components.Powerup(data.message.powerupState, texture, data.message.type);
        powerups[data.message.key] = newPowerup;
    }

    that.deletePowerup = function(id){
        delete powerups[id];
    }

    function getTexture(type){
        let texture = '';
        switch (type) {
            case "spread-shot":
                texture = "red-powerup";
                break;
            case "rapid-fire":
                texture = "yellow-powerup";
                break;
            case "shields":
                texture = "blue-powerup";
                break;
            case "guided-missiles":
                texture = "green-powerup";
                break;
        }
        return texture;
    }

    return that;
}())