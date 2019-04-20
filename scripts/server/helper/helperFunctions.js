let toggleTop = true;
const performance = require('perf_hooks').performance;
//------------------------------------------------------------------
//
// Helper function to generate a new random center along the edges
// of the world.
//
// Use for new asteroids and ufos
//
//------------------------------------------------------------------
function generateNewRandomCenter(){
    let x = (toggleTop) ? Math.floor(Math.random() * 10) : -.1;
    let y = (toggleTop) ? -.1 : Math.floor(Math.random() * 10);
    toggleTop = !toggleTop;
    return { x: x, y: y }
}

//------------------------------------------------------------------
//
// Helper function to pad a number with 0s
//
//------------------------------------------------------------------
function numberPad(number, padding){
    number += '';
    return number.padStart(padding, '0');
}

function getTime(){
    return performance.now();
}

//------------------------------------------------------------------
//
// Helper function to randomly choose between positive and negative
//
//------------------------------------------------------------------
function generatePosNeg(){
    return Math.random() < 0.5 ? -1 : 1
}

//------------------------------------------------------------------
//
// Helper functions to find safe location
//
//------------------------------------------------------------------
function getDistance(center1, center2){
    return Math.sqrt(
        Math.pow(center2.x - center1.x, 2) +
        Math.pow(center2.y - center1.y, 2)
    );
}

let random = require ('../random');
function findSafeSpot(asteroids,ufos,missiles){
    let safeDistance = .5; 
    let notSafe = true;
    let newCenter = { x: 0, y: 0 };
    while(notSafe){
        notSafe = false;
        newCenter.x = random.nextRange(1, 9);
        newCenter.y = random.nextRange(1, 9);

        // check if safe distance from all asteroids
        for(let index in asteroids){
            if(getDistance(asteroids[index].state.center,newCenter) < safeDistance){
                notSafe = true;
            }
        }

        if(notSafe) continue;

        // check if safe distance from all ufos
        for(let index in ufos){
            if(getDistance(ufos[index].state.center,newCenter) < safeDistance){
                notSafe = true;
            }
        }

        if(notSafe) continue;

        // check if safe distance from all enemy missiles 
        for(let index in missiles){
            if(getDistance(missiles[index].state.center,newCenter) < safeDistance){
                notSafe = true;
            }
        }

        if(notSafe) continue;
    }
    return newCenter;
}
module.exports.generateNewRandomCenter = generateNewRandomCenter;
module.exports.numberPad = numberPad;
module.exports.generatePosNeg = generatePosNeg;
module.exports.getTime = getTime;
module.exports.findSafeSpot = findSafeSpot;