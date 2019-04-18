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

    that.createPlayerMissile = function(rotation, spaceState,missileSpeed){
        let vectorX = Math.cos(rotation);
        let vectorY = Math.sin(rotation);

        let newMissile = missile.create({
            state : {
                size:{width:.075, height:.025},
                momentum: {
                    x: spaceState.momentum.x + (vectorX * missileSpeed),
                    y: spaceState.momentum.y + (vectorY * missileSpeed)
                },
                rotation:spaceState.rotation,
                maxSpeed:spaceState.maxSpeed + missileSpeed,
                center: spaceState.center
            },
            owner:"player"
        });
            
        let id = getNextID();
        newMissile.setRemainingLife(missileLife);
        missiles[id] = newMissile;
        newMissiles.push(id);
    }

    that.createEnemyMissile = function(rotation, spaceState, missileSpeed){
        let vectorX = Math.cos(rotation);
        let vectorY = Math.sin(rotation);

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
        missiles[id] = newMissile;
        newMissiles.push(id);

        //console.log("New missile generated state: ", missiles[id].state, );
    }

    that.reset = function(){
        missiles = [];
    }
    that.deleteMissile = function(id){
        delete missiles[id];
        missilesDestroyed.push(id);
    }

    that.clearNewMissiles = function(){
        // console.log('clear new missiles called, current length: ', newMissiles.length);
        newMissiles.length = 0;
        
        // console.log('length after clearing: ', newMissiles.length);
    }
    that.clearMissilesDestroyed = function(){
        missilesDestroyed.length = 0;
    }

    
    return that;
};

module.exports.createMissileHandler = () => missileHandler();