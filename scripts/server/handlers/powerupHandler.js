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

    let powerupGenerationRate = 1 / 30000; // however many every 20000 milliseconds
    let timeSinceLastPowerup = 0; 

    Object.defineProperty(that, 'powerups', {
        get: () => powerups
    })

    Object.defineProperty(that, 'newPowerups', {
        get: () => newPowerups
    })

    Object.defineProperty(that, 'destroyedPowerups', {
        get: () => destroyedPowerups
    })

    that.update = function(elapsedTime){
        timeSinceLastPowerup += elapsedTime; // generate a new asteroid if necesary
        if (timeSinceLastPowerup * powerupGenerationRate > 1){
            that.createNewPowerup(1);
            timeSinceLastPowerup = 0;
        }
    }

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

    that.clearNewAndDestroyedPowerups = function(){
        destroyedPowerups = [];
        newPowerups = [];
    }

    function getRandomPowerupType(){
        let type = "";
        let randomNum = Math.random();
        if (randomNum <= .2){
            type = "no-shot";
        } else if (randomNum > .2 && randomNum <= .4){
            type = "rapid-fire"
        } else if (randomNum > .4 && randomNum <= .8){
            type = "spread-shot"
        } else if (randomNum < 1){
            type = "split-shot"
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