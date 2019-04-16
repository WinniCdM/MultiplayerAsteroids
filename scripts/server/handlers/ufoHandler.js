// ------------------------------------------------------------------
//
// Nodejs module that represents the handler for all UFOs
//
// ------------------------------------------------------------------
'use strict';

let random = require ('../random');



function ufoHandler(){
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
        let newOrientation = random.nextCircleVector();
    }


    return that;
};

module.exports.createUFOHandler = () => ufoHandler();