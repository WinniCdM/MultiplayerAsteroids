// ------------------------------------------------------------------
//
// Nodejs module that represents the handler for all Missiles
//
// ------------------------------------------------------------------
'use strict';

let random = require ('../random');
let missile = require ('../objects/missile');


function missileHandler(){
    let that = {};

    let missiles = {};
    let missileLife = 100;

    let nextID = 0;
    let newMissiles = [];
    let missilesDestroyed = [];



    Object.defineProperty(that, 'missiles', {
        get: () => missiles
    });
    Object.defineProperty(that, 'newMissiles', {
        get: () => newMissiles
    });
    Object.defineProperty(that, 'missilesDestroyed', {
        get: () => missilesDestroyed
    });

    function getNextID(){
        return nextID++;
    }

    that.update = function(elapsedTime){
        let missilesToDelete = [];



        for(let id in missiles){
            missiles[id].update(elapsedTime);

            if(missiles[id].remainingLife <= 0){
                missilesToDelete.push(id);
                missiles[id].setRemainingLife(missileLife);
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
            
        let id = getNextID();
        newMissile.setRemainingLife(missileLife);
        missiles.push(id,newMissile);
        newMissiles.push(id);
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
        let id = getNextID();
        newMissile.setRemainingLife(missileLife);
        missiles.push(id,newMissile);
        newMissiles.push(id);
    }

    that.reset = function(){
        missiles = [];
    }
    that.deleteMissile = function(id){
        delete missiles[id];
        missilesDestroyed.push(id);
    }

    that.clearNewMissiles = function(){
        newMissiles = [];
    }
    that.clearMissilesDestroyed = function(){
        missilesDestroyed = [];
    }

    
    return that;
};

module.exports.createMissileHandler = () => missileHandler();