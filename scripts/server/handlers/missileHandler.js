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
    let missileLife = 2000;

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
            that.deleteMissile(missilesToDelete[i]);
        }
    }

    that.createPlayerMissile = function(rotation, spaceState, missileSpeed, clientID){
        let vectorX = Math.cos(rotation);
        let vectorY = Math.sin(rotation);

        let id = getNextID();
        let newMissile = missile.create({
            state : {
                size:{width:.065, height:.015},
                momentum: {
                    x: spaceState.momentum.x + (vectorX * missileSpeed),
                    y: spaceState.momentum.y + (vectorY * missileSpeed)
                },
                rotation:rotation,
                maxSpeed:spaceState.maxSpeed + missileSpeed,
                center: {x:spaceState.center.x,y:spaceState.center.y},
                id:id
            },
            owner:"player",
            clientID: clientID
        });
            
        
        newMissile.setRemainingLife(missileLife);
        missiles[id] = newMissile;
        newMissiles.push(id);

    }

    that.createEnemyMissile = function(rotation, spaceState, missileSpeed){
        let vectorX = Math.cos(rotation);
        let vectorY = Math.sin(rotation);
        
        let id = getNextID();
        let newMissile = missile.create({
            state : {
                size: { width:.065, height:.015 },
                momentum: {
                    x: vectorX * missileSpeed,
                    y: vectorY * missileSpeed
                },
                rotation: rotation,
                maxSpeed: spaceState.maxSpeed + missileSpeed,
                center: { x: spaceState.center.x, y: spaceState.center.y},
                id: id
            },
            owner:"enemy",
            clientID: -1
        });
        
        newMissile.setRemainingLife(missileLife);
        missiles[id] = newMissile;
        newMissiles.push(id);
    }

    that.reset = function(){
        missiles = {};
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