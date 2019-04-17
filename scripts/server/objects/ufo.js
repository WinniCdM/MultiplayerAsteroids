// ------------------------------------------------------------------
//
// Nodejs module that represents the model for a UFO.
//
// ------------------------------------------------------------------
'use strict';

let random = require ('../random');


//------------------------------------------------------------------
//
// Public function used to initially create a new UFO
//
//------------------------------------------------------------------
function createUFO(spec,missileHandler) {
    let that = {};

    let state = spec.state;
    let maxSpeed = spec.maxSpeed;
    let timeSinceLastShot = spec.fireRate;
    let smartShot = spec.smartShot;
    let missileSpeed = spec.missileSpeed;


    Object.defineProperty(that, 'state', {
        get: () => state
    });
    Object.defineProperty(that, 'isSmart', {
        get: () => smartShot
    });

    //Might not need this????
    let reportUpdate = false;           // Indicates if this model was updated during the last update
    Object.defineProperty(that, 'reportUpdate', {
        get: () => reportUpdate,
        set: value => reportUpdate = value
    });


    that.update = function(elapsedTime){

        timeSinceLastShot += elapsedTime;
        fire();
        //update the state of this object
        updateCenter(elapsedTime);
        rotate(elapsedTime);
    }

    function updateCenter(elapsedTime){
        state.center.x += state.momentum.x * elapsedTime;
        state.center.y += state.momentum.y * elapsedTime;
        if (state.center.x < -.1){
            state.center.x = 10.1;
        }
        if (state.center.x > 10.1){
            state.center.x = -.1;
        }
        
        if (state.center.y < -.1){
            state.center.y = 10.1;
        }
        if (state.center.y > 10.1){
            state.center.y = -.1;
        }
    }
    function rotate(elapsedTime){
        state.rotation += state.rotationRate;
    }

    function fire(){
        
        if(timeSinceLastShot >= spec.fireRate){
            timeSinceLastShot = 0;
            let missileRotation = 0;
            //Need to figure out smart shooting
            if (smartShot){
                // let playerCenter = TheGame.GameModel.player.state.center;
                // let accuracyModifier = (1.5 / TheGame.GameModel.level);

                // let absMissileOrientation = Math.atan((playerCenter.y - position.y)/(playerCenter.x - position.x));
                // while (absMissileOrientation < -Math.PI) absMissileOrientation += Math.PI;
                // while (absMissileOrientation >= Math.PI) absMissileOrientation -= Math.PI;
                // if (playerCenter.x < position.x) absMissileOrientation += Math.PI;

                // missileOrientation = Random.nextRange(absMissileOrientation-accuracyModifier, absMissileOrientation+accuracyModifier);
                missileRotation = random.nextDouble() * 2 * Math.PI;
            } else {
                missileRotation = random.nextDouble() * 2 * Math.PI;
            }

            missileHandler.createEnemyMissile(missileRotation,state,missileSpeed)
        }
    }

    return that;
}

module.exports.create = (spec,missileHandler) => createUFO(spec,missileHandler);
