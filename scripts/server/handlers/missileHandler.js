// ------------------------------------------------------------------
//
// Nodejs module that represents the handler for all Missiles
//
// ------------------------------------------------------------------
'use strict';

let random = require ('../random');
let missile = require ('../objects/missile');


function missileHandler(){
    that = {};

    let missiles = [];
    let missileLife = 100;

    function deleteMissile(index){
        missiles.splice(index, 1);
    }

    Object.defineProperty(that, 'missiles', {
        get: () => missiles
    });


    that.update = function(elapsedTime){
        let missilesToDelete = [];

        for (let i = 0; i < missiles.length; i++){
            missiles[i].update(elapsedTime);

            if (missiles[i].remainingLife <= 0){
                missilesToDelete.push(i);   
                missiles[i].setRemainingLife(missileLife);
            }
        }

        for (let i = 0; i < missilesToDelete.length; i++){
            deleteMissile(missilesToDelete[i]);
        }
    }

    that.createPlayerMissile = function(spaceState,missileSpeed){
        let vectorX = Math.cos(spaceState.rotation);
        let vectorY = Math.sin(spaceState.rotation);

        let newMissile = missile.create({
            state : {
                size:{width:.075, height:.025},
                momentum: {
                    x: vectorX * missileSpeed,
                    y: vectorY * missileSpeed
                },
                rotation:spaceState.rotation,
                maxSpeed:spaceState.maxSpeed + missileSpeed,
                center: spaceState.center
            },
            owner:"player"
        });
            
        newMissile.setRemainingLife(missileLife);
        missiles.push(newMissile);
    }

    that.createEnemyMissile = function(rotation, spaceState, missileSpeed){
        let vectorX = Math.cos(orientation);
        let vectorY = Math.sin(orientation);

        let newMissile = missile.create({
            state : {
                size:{width:.075, height:.025},
                momentum: {
                    x: vectorX * missileSpeed,
                    y: vectorY * missileSpeed
                },
                rotation:rotation,
                maxSpeed:spaceState.maxSpeed + missileSpeed,
                center: spaceState.center
            },
            owner:"enemy"
        });

        newMissile.setRemainingLife(missileLife);
        missiles.push(newMissile);
    }

    that.reset = function(){
        missiles = [];
    }



    
    return that;
};

module.exports.createMissileHandler = () => missileHandler();