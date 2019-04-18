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

    that.state = spec.state;
    let maxSpeed = spec.maxSpeed;
    let timeSinceLastShot = spec.fireRate;
    let smartShot = spec.smartShot;
    let missileSpeed = spec.missileSpeed;
    that.smartShot = spec.smartShot;


    that.update = function(elapsedTime){

        //console.log('ufo located: ', that.state.center);
        timeSinceLastShot += elapsedTime;
        fire();
        //update the that.state of this object
        updateCenter(elapsedTime);
        rotate(elapsedTime);
    }

    function updateCenter(elapsedTime){
        //console.log('that.state.center before update: ', that.state.center);
        that.state.center.x += that.state.momentum.x * elapsedTime;
        that.state.center.y += that.state.momentum.y * elapsedTime;
        if (that.state.center.x < -.1){
            that.state.center.x = 10.1;
        }
        if (that.state.center.x > 10.1){
            that.state.center.x = -.1;
        }
        
        if (that.state.center.y < -.1){
            that.state.center.y = 10.1;
        }
        if (that.state.center.y > 10.1){
            that.state.center.y = -.1;
        }
        //console.log('that.state after update: ', that.state.center);
    }
    function rotate(elapsedTime){
        that.state.rotation += that.state.rotationRate;
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

            //console.log('ufo creating missile at: ', state.center);
            missileHandler.createEnemyMissile(missileRotation,that.state,missileSpeed)
        }
    }

    return that;
}

module.exports.create = (spec,missileHandler) => createUFO(spec,missileHandler);
