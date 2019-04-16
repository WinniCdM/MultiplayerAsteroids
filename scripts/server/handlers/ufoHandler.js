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
    that = {};

    let ufos = [];

    let timeSinceLastSmallUFOSpawn = 0;
    let timeSinceLastLargeUFOSpawn = 0;
    let smallUFOSpawnRate = 60000;
    let largeUFOSpawnRate = 40000;

    that.update = function(elapsedTime){
        handleUFOSpawning(elapsedTime);
        for (let i = 0; i < ufos.length; i++){
            ufos[i].update(elapsedTime);
        }
    }

    that.createUFO = function(smart){

        let newUFOSpec = {
            state: {
                size: { width:0,height:0},
                momentum: random.nextCircleVector(.1),//Should set x and y, not sure
                rotation: random.nextDouble() * 2 * Math.PI,
                maxSpeed: 200/1000,
                center: helpers.generateNewRandomCenter(),
            },
            fireRate: 1000,
            smarthhot: false,
            missileSpeed: 1
        }

        if(smart){
            newUFOSpec.size = {width: .04, height: .04};
            newUFOSpec.smartShot = true;
        }
        else{
            newUFOSpec.size = {width:.075,height:.075};
        }

        ufos.push(UFO.create(newUFOSpec,missileHandler));
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

    that.deleteUFO = function(index){
        ufos.splice(index, 1);
    }

    that.reset = function(){
        timeSinceLastLargeUFOSpawn = 0;
        timeSinceLastSmallUFOSpawn = 0;
        ufos = [];
    }


    return that;
};

module.exports.createUFOHandler = (missileHandler) => ufoHandler(missileHandler);