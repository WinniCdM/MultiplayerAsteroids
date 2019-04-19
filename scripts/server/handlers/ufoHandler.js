// ------------------------------------------------------------------
//
// Nodejs module that represents the handler for all UFOs
//
// ------------------------------------------------------------------
'use strict';

let random = require ('../random');
let helpers = require ('../helper/helperFunctions');
let UFO = require ('../objects/ufo');

function ufoHandler(missileHandler,activeClients){
    let that = {};

    let ufos = {};

    let timeSinceLastSmallUFOSpawn = 0;
    let timeSinceLastLargeUFOSpawn = 0;
    let smallUFOSpawnRate = 6000;
    let largeUFOSpawnRate = 4000;

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
        let id = getNextID();
        let newUFOSpec = {
            state: {
                size: { width:0,height:0},
                momentum: {x:0.0001,y:0},//random.nextCircleVector(.0002),
                rotation: random.nextDouble() * 2 * Math.PI,
                maxSpeed: 200/1000,
                center: {x:1,y:1},//helpers.generateNewRandomCenter(),
                rotationRate: Math.PI / 1000,
                id:id
            },
            fireRate: 3000,
            smartShot: false,
            missileSpeed: .001
        }

        if(smart){
            newUFOSpec.state.size = {width: .04, height: .04};
            newUFOSpec.smartShot = true;
        }
        else{
            newUFOSpec.state.size = {width:.075,height:.075};
        }

        ufos[id] = UFO.create(newUFOSpec,missileHandler,activeClients);
        newUFOs.push(id);
    }

    let test = true;
    function handleUFOSpawning(elapsedTime){
        timeSinceLastSmallUFOSpawn += elapsedTime;
        timeSinceLastLargeUFOSpawn += elapsedTime;
        if (timeSinceLastLargeUFOSpawn >= largeUFOSpawnRate && false){
            createUFO(false);
            timeSinceLastLargeUFOSpawn = 0;
        }
        if (timeSinceLastSmallUFOSpawn >= smallUFOSpawnRate && test){
            createUFO(true);
            timeSinceLastSmallUFOSpawn = 0;
            test = false;
        }
    }

    that.update = function(elapsedTime){
        
        handleUFOSpawning(elapsedTime);
        for(let id in ufos){
            ufos[id].update(elapsedTime);
        }
    }

    that.deleteUFO = function(id){
        delete ufos[id];
        UFOsDestroyed.push(id);

    }

    that.reset = function(){
        timeSinceLastLargeUFOSpawn = 0;
        timeSinceLastSmallUFOSpawn = 0;
        ufos.length = 0;
    }

    that.clearNewUFOS = function(){
        newUFOs.length = 0;
    }
    that.clearUFOsDestroyed = function(){
        UFOsDestroyed.length = 0;
    }


    return that;
};

module.exports.createUFOHandler = (missileHandler,activeClients) => ufoHandler(missileHandler,activeClients);