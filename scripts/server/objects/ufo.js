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
function createUFO(spec,missileHandler,activeClients) {
    let that = {};

    that.state = spec.state;
    let maxSpeed = spec.maxSpeed;
    let timeSinceLastShot = spec.fireRate;
    let smartShot = spec.smartShot;
    let missileSpeed = spec.missileSpeed;
    that.smartShot = spec.smartShot;


    that.update = function(elapsedTime){

        timeSinceLastShot += elapsedTime;
        fire();
        updateCenter(elapsedTime);
        rotate(elapsedTime);
    }

    function updateCenter(elapsedTime){
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
                missileRotation = getSmartShotRotation();
            } else {
                missileRotation = random.nextDouble() * 2 * Math.PI;
            }

            missileHandler.createEnemyMissile(missileRotation,that.state,missileSpeed)
        }
    }


    function getSmartShotRotation(){
        let targetID = findNearestPlayer();
        let targetCenter = activeClients[targetID].player.position;
        let accuracyModifier = (1.5 / (activeClients[targetID].player.score + 1));

        let absMissileOrientation = Math.atan((targetCenter.y - this.state.center.y)/(targetCenter.x - this.state.center.x));
        while (absMissileOrientation < -Math.PI) absMissileOrientation += Math.PI;
        while (absMissileOrientation >= Math.PI) absMissileOrientation -= Math.PI;
        if (playerCenter.x < position.x) absMissileOrientation += Math.PI;

        return random.nextRange(absMissileOrientation-accuracyModifier, absMissileOrientation+accuracyModifier);
    }


    function findNearestPlayer(){
        let closestID = -1;
        let closestDistance = 10;
        for (let clientId in activeClients) {
            let currentPlayerCenter = activeClients[clientId].player.position;
            let currDistance = getDistance(currentPlayerCenter, this.state.center);
            if(closestDistance > currDistance){
                closestDistance = currDistance;
                closestID = clientID;
            }
        }
        return closestID;
    }

    function getDistance(center1, center2){
        let x = center1.x - center2.x;
        let y = center1.y - center2.y;
        return Math.sqrt(x*x + y*y);
    }

    return that;
}

module.exports.create = (spec,missileHandler) => createUFO(spec,missileHandler);
