// ------------------------------------------------------------------
//
// Nodejs module that represents the model for an powerup handler 
// object.
//
// ------------------------------------------------------------------
let Powerup = require("../objects/powerup");

// ------------------------------------------------------------------
//
// Public function to create a new powerup handler
//
// ------------------------------------------------------------------
function powerupHandler(){
    let that = {};
    let powerups = {};
    let newPowerups = [];
    let destroyedPowerups = [];
    let id = 0;

    Object.defineProperty(that, 'powerups', {
        get: () => powerups
    })

    Object.defineProperty(that, 'newPowerups', {
        get: () => newPowerups
    })

    Object.defineProperty(that, 'destroyedPowerups', {
        get: () => destroyedPowerups
    })

    that.createNewPowerup = function(number){
        for (let i = 0; i < number; i++){
            powerups[getIdForNewPowerup()] =
                Powerup.create(getRandomPowerupType());
        }
    }

    that.deletePowerup = function(id){
        delete powerups[id];
        destroyedPowerups.push(id);
    }

    function getRandomPowerupType(){
        let type = "";
        let randomNum = Math.random();
        if (randomNum <= .2){
            type = "shields";
        } else if (randomNum > .2 && randomNum <= .4){
            type = "rapid-fire"
        } else if (randomNum > .4 && randomNum <= .8){
            type = "spread-shot"
        } else if (randomNum < 1){
            type = "guided-missiles"
        }
        return type;
    }

    function getIdForNewPowerup(){
        let newId = id++
        newPowerups.push(newId);
        return newId;
    }

    return that;
}

module.exports.create = () => powerupHandler();