// ------------------------------------------------------------------
//
// Nodejs module that represents the handler for all UFOs
//
// ------------------------------------------------------------------
'use strict';

let random = require ('../random');
let helpers = require ('../../shared/helper/helperFunctions');
let UFO = require ('../objects/ufo');




function ufoHandler(missileHandler){
    let that = {};

    let ufos = {};

    let timeSinceLastSmallUFOSpawn = 0;
    let timeSinceLastLargeUFOSpawn = 0;
    let smallUFOSpawnRate = 60000;
    let largeUFOSpawnRate = 40000;

    let nextID = 0;
    let newUFOs = [];
    let UFOsDestroyed = [];

    Object.defineProperty(that, 'ufos', {
        get: () => ufos
    });
    Object.defineProperty(that, 'newUFOs', {
        get: () => newUFOs
    });
    Object.defineProperty(that, 'UFOsDestroyed', {
        get: () => UFOsDestroyed
    });

    function getNextID(){
        return nextID++;
    }

    function createUFO(smart){

        let newUFOSpec = {
            state: {
                size: { width:0,height:0},
                momentum: random.nextCircleVector(.3),//Should set x and y, not sure
                rotation: random.nextDouble() * 2 * Math.PI,
                maxSpeed: 200/1000,
                center: helpers.generateNewRandomCenter(),
                rotationRate: random.nextRange(Math.PI / 1000,Math.PI / 100);
            },
            fireRate: 1000,
            smartShot: false,
            missileSpeed: 1
        }

        if(smart){
            newUFOSpec.size = {width: .04, height: .04};
            newUFOSpec.smartShot = true;
        }
        else{
            newUFOSpec.size = {width:.075,height:.075};
        }

        let id = getNextID();
        ufos.push(id,UFO.create(newUFOSpec,missileHandler));
        newUFOs.push(id);
    }

    function handleUFOSpawning(elapsedTime){
        timeSinceLastSmallUFOSpawn += elapsedTime;
        timeSinceLastLargeUFOSpawn += elapsedTime;
        if (timeSinceLastLargeUFOSpawn >= largeUFOSpawnRate){
            createUFO(false);
            timeSinceLastLargeUFOSpawn = 0;
        }
        if (timeSinceLastSmallUFOSpawn >= smallUFOSpawnRate){
            createUFO(true);
            timeSinceLastSmallUFOSpawn = 0;
        }
    }

    that.update = function(elapsedTime){
        handleUFOSpawning(elapsedTime);
        for (let i = 0; i < ufos.length; i++){
            ufos[i].update(elapsedTime);
        }
    }

    that.deleteUFO = function(id){
        delete ufos[id];
        UFOsDestroyed.push(id);

    }

    that.reset = function(){
        timeSinceLastLargeUFOSpawn = 0;
        timeSinceLastSmallUFOSpawn = 0;
        ufos = [];
    }

    that.clearNewUFOS = function(){
        newUFOs = [];
    }
    that.clearUFOsDestroyed = function(){
        UFOsDestroyed = [];
    }


    return that;
};

module.exports.createUFOHandler = (missileHandler) => ufoHandler(missileHandler);