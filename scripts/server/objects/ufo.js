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

    
    Object.defineProperty(that, 'isSmart', {
        get: () => smartShot
    });
    // console.log('ufo created at: ', that.state.center);


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
            if (smartShot){
                missileRotation = getSmartShotRotation();
            } else {
                missileRotation = random.nextDouble() * 2 * Math.PI;
            }

            missileHandler.createEnemyMissile(missileRotation,that.state,missileSpeed)
        }
    }


    function getSmartShotRotation(){
        if(Object.keys(activeClients).length){
            let targetID = findNearestPlayer();
            let targetCenter = activeClients[targetID].player.position;
            let accuracyModifier = (1.5 / (activeClients[targetID].player.score + 1));
    
            let absMissileOrientation = Math.atan((targetCenter.y - that.state.center.y)/(targetCenter.x - that.state.center.x));
            while (absMissileOrientation < -Math.PI) absMissileOrientation += Math.PI;
            while (absMissileOrientation >= Math.PI) absMissileOrientation -= Math.PI;
            if (targetCenter.x < that.state.center.x) absMissileOrientation += Math.PI;
    
            return random.nextRange(absMissileOrientation-accuracyModifier, absMissileOrientation+accuracyModifier);
        }else{
            return random.nextDouble() * 2 * Math.PI
        }
        
    }


    function findNearestPlayer(){
        let closestID = -1;
        let closestDistance = 100;
        for (let clientId in activeClients) {
            let currentPlayerCenter = activeClients[clientId].player.position;
            let currDistance = getDistance(currentPlayerCenter, that.state.center);
            if(closestDistance > currDistance){
                closestDistance = currDistance;
                closestID = clientId;
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

module.exports.create = (spec,missileHandler,activeClients) => createUFO(spec,missileHandler,activeClients);
