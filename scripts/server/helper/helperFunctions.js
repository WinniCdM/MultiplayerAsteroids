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

//------------------------------------------------------------------
//
// Helper function to get the time
//
//------------------------------------------------------------------
function getTime(){
    return performance.now();
}

//------------------------------------------------------------------
//
// Helper function to calculate the distance between two centers
//
//------------------------------------------------------------------
function getDistance(center1, center2){
    return Math.sqrt(
        Math.pow(center2.x - center1.x, 2) +
        Math.pow(center2.y - center1.y, 2)
    );
}

//------------------------------------------------------------------
//
// Helper function to randomly choose between positive and negative
//
//------------------------------------------------------------------
function generatePosNeg(){
    return Math.random() < 0.5 ? -1 : 1
}
module.exports.generateNewRandomCenter = generateNewRandomCenter;
module.exports.numberPad = numberPad;
module.exports.generatePosNeg = generatePosNeg;
module.exports.getTime = getTime;
module.exports.getDistance = getDistance;